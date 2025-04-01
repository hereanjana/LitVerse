from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from typing import List, Optional
import httpx
import logging
from database import get_db
from datetime import datetime
from database import SessionLocal, engine
from models import Base, Book, Author, Subject, book_author, book_subject

# Initialize FastAPI app
router = APIRouter()
# Create database tables
Base.metadata.create_all(bind=engine)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Dependency to get DB session

async def fetch_book_details(work_key: str):
    """Fetch detailed book information from Open Library"""
    # Extract the work ID from the key (e.g., /works/OL66554W -> OL66554W)
    work_id = work_key.split('/')[-1]
    url = f"https://openlibrary.org/works/{work_id}.json"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error occurred while fetching book details: {e}")
            return {}
        except Exception as e:
            logger.error(f"Unexpected error occurred: {e}")
            return {}
        
async def fetch_books_from_openlibrary(subject: str, limit: int = 50):
    """Fetch books from Open Library API based on subject"""
    url = f"https://openlibrary.org/subjects/{subject.lower()}.json?limit={limit}"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error occurred while fetching books: {e}")
            raise HTTPException(status_code=503, detail=f"Failed to fetch data from Open Library: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error occurred: {e}")
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")   

async def process_and_save_books(background_tasks: BackgroundTasks, subject: str, db: Session):
    """Process books data and save to database"""
    data = await fetch_books_from_openlibrary(subject)
    
    # Get or create subject record
    db_subject = db.query(Subject).filter(Subject.name == subject.lower()).first()
    if not db_subject:
        db_subject = Subject(name=subject.lower())
        db.add(db_subject)
        db.commit()
        db.refresh(db_subject)
    
    books_added = 0
    books_skipped = 0
    
    for work in data.get("works", []):
        # Check if book already exists by OpenLibrary key
        existing_book = db.query(Book).filter(Book.open_library_key == work.get("key")).first()
        if existing_book:
            books_skipped += 1
            continue
        
        # Fetch additional book details including description
        book_details = await fetch_book_details(work.get("key"))
        
        # Extract description
        description = None
        if book_details.get("description"):
            if isinstance(book_details["description"], dict):
                description = book_details["description"].get("value", "")
            else:
                description = book_details["description"]
        
        # Create new book record
        new_book = Book(
            title=work.get("title"),
            description=description,  # Add the description
            open_library_key=work.get("key"),
            cover_id=work.get("cover_id"),
            cover_edition_key=work.get("cover_edition_key"),
            first_publish_year=work.get("first_publish_year"),
            edition_count=work.get("edition_count"),
            is_readable=work.get("has_fulltext", False),
            is_lendable=False,
            is_previewable=False
        )
        
        # Extract availability info if present
        availability = work.get("availability", {})
        if availability:
            new_book.is_readable = availability.get("is_readable", False)
            new_book.is_lendable = availability.get("is_lendable", False)
            new_book.is_previewable = availability.get("is_previewable", False)
            new_book.isbn = availability.get("isbn")
        
        # Add book to session
        db.add(new_book)
        db.flush()
        
        # Process authors (rest of the code remains the same)
        for author_data in work.get("authors", []):
            author_key = author_data.get("key")
            author_name = author_data.get("name")
            
            if not author_key or not author_name:
                continue
                
            # Check if author exists
            author = db.query(Author).filter(Author.open_library_key == author_key).first()
            if not author:
                author = Author(name=author_name, open_library_key=author_key)
                db.add(author)
                db.flush()
            
            # Associate author with book
            new_book.authors.append(author)
        
        # Associate book with subject
        new_book.subjects.append(db_subject)
        
        # Process additional subjects
        for subject_name in work.get("subject", [])[:10]:
            subject_name = subject_name.lower()
            existing_subject = db.query(Subject).filter(Subject.name == subject_name).first()
            
            if not existing_subject:
                existing_subject = Subject(name=subject_name)
                db.add(existing_subject)
                db.flush()
            
            if existing_subject not in new_book.subjects:
                new_book.subjects.append(existing_subject)
        
        books_added += 1
    
    # Commit all changes
    db.commit()
    
    return {
        "subject": subject,
        "books_added": books_added,
        "books_skipped": books_skipped,
        "total_books_processed": books_added + books_skipped
    }

@router.post("/books/import/{subject}")
async def import_books_by_subject(
    subject: str, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Import books from Open Library based on subject/genre
    
    - **subject**: The subject/genre to fetch books for (e.g., fiction, mystery, science-fiction)
    """
    # Start the import process
    result = await process_and_save_books(background_tasks, subject, db)
    return result

@router.get("/books/")
async def list_books(
    subject: Optional[str] = None,
    author: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    List books with optional filtering
    
    - **subject**: Filter books by subject/genre
    - **author**: Filter books by author name
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    """
    query = db.query(Book)
    
    if subject:
        query = query.join(Book.subjects).filter(Subject.name == subject.lower())
    
    if author:
        query = query.join(Book.authors).filter(Author.name.ilike(f"%{author}%"))
    
    total = query.count()
    books = query.offset(skip).limit(limit).all()
    
    return {
        "total": total,
        "books": [{
            "id": book.id,
            "title": book.title,
            "authors": [author.name for author in book.authors],
            "description": book.description,
            "subjects": [subject.name for subject in book.subjects],
            "first_publish_year": book.first_publish_year,
            "cover_id": book.cover_id
        } for book in books]
    }

@router.get("/subjects/")
async def list_subjects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all available subjects/genres"""
    subjects = db.query(Subject).offset(skip).limit(limit).all()
    return {
        "total": db.query(Subject).count(),
        "subjects": [{"id": subject.id, "name": subject.name} for subject in subjects]
    }

# For completeness, add a database.py file
"""
# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/bookdb"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
"""

# Make sure to update the SQLALCHEMY_DATABASE_URL with your actual PostgreSQL credentials