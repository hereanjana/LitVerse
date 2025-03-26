from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from models.book import Book
from database import get_db
from models.genre import Genre
from pydantic import BaseModel

router = APIRouter()

# Schema for creating a book
class BookCreate(BaseModel):
    title: str
    author: str
    isbn: str
    publication_date: Optional[date] = None
    summary: Optional[str] = None
    cover_image_url: Optional[str] = None
    genre_names: List[str]

# Example of adding genres
@router.post("/genres")
async def create_genre(name: str, db: Session = Depends(get_db)):
    genre = Genre(name=name)
    db.add(genre)
    db.commit()
    return {"message": f"Genre '{name}' created successfully"}

@router.post("/books")
async def create_book(book_data: BookCreate, db: Session = Depends(get_db)):
    try:
        # Create new book without genre
        book = Book(
            title=book_data.title,
            author=book_data.author,
            isbn=book_data.isbn,
            publication_date=book_data.publication_date,
            summary=book_data.summary,
            cover_image_url=book_data.cover_image_url
        )

        # Verify and add genres
        for genre_name in book_data.genre_names:
            genre = db.query(Genre).filter(Genre.name == genre_name).first()
            if not genre:
                raise HTTPException(
                    status_code=404,
                    detail=f"Genre '{genre_name}' not found"
                )
            book.genres.append(genre)

        db.add(book)
        db.commit()
        db.refresh(book)

        return {
            "message": f"Book '{book_data.title}' created successfully",
            "book": {
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "isbn": book.isbn,
                "publication_date": book.publication_date,
                "summary": book.summary,
                "genres": [genre.name for genre in book.genres],
                "cover_image_url": book.cover_image_url
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/genres")
async def list_genres(db: Session = Depends(get_db)):
    genres = db.query(Genre).all()
    return [{"id": genre.id, "name": genre.name} for genre in genres]

@router.get("/books")
async def list_books(db: Session = Depends(get_db)):
    books = db.query(Book).all()
    return [
        {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "isbn": book.isbn,
            "publication_date": book.publication_date,
            "summary": book.summary,
            "genres": [genre.name for genre in book.genres],
            "cover_image_url": book.cover_image_url
        } for book in books
    ]

@router.get("/books/{book_id}")
async def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    return {
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "isbn": book.isbn,
        "publication_date": book.publication_date,
        "summary": book.summary,
        "genres": [genre.name for genre in book.genres],
        "cover_image_url": book.cover_image_url
    }

@router.put("/books/{book_id}/genres")
async def update_book_genres(
    book_id: int,
    genre_names: List[str],
    db: Session = Depends(get_db)
):
    try:
        book = db.query(Book).filter(Book.id == book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")

        # Clear existing genres
        book.genres.clear()

        # Add new genres
        for genre_name in genre_names:
            genre = db.query(Genre).filter(Genre.name == genre_name).first()
            if not genre:
                raise HTTPException(
                    status_code=404,
                    detail=f"Genre '{genre_name}' not found"
                )
            book.genres.append(genre)

        db.commit()

        return {
            "message": "Book genres updated successfully",
            "book": {
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "isbn": book.isbn,
                "publication_date": book.publication_date,
                "summary": book.summary,
                "genres": [genre.name for genre in book.genres],
                "cover_image_url": book.cover_image_url
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Add a route to search books by genre
@router.get("/books/by-genre/{genre_name}")
async def get_books_by_genre(genre_name: str, db: Session = Depends(get_db)):
    genre = db.query(Genre).filter(Genre.name == genre_name).first()
    if not genre:
        raise HTTPException(status_code=404, detail=f"Genre '{genre_name}' not found")
    
    return [
        {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "isbn": book.isbn,
            "publication_date": book.publication_date,
            "summary": book.summary,
            "genres": [g.name for g in book.genres],
            "cover_image_url": book.cover_image_url
        } for book in genre.books
    ]
