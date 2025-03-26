from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from models.user import User
from models.onboarded_user import Onboarded_User
from crud.genres import get_genre_id
from crud.onboarded_users import save
from database import SessionLocal, get_db
from models.genre import Genre
from models.book import Book
from schemas.user import UserOnboardingSchema
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/users/")
def read_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.post("/users/onboarding")
async def save_user(payload: UserOnboardingSchema, db: Session = Depends(get_db)):
    try:
        # Extract genres and books from the payload
        extracted_genres = payload.genres
        extracted_books = payload.books  # Get the books from payload

        # Validate genres
        if not extracted_genres:
            raise HTTPException(status_code=400, detail="No genres selected")

        # Save the user's selected genres
        user = Onboarded_User()
        db.add(user)
        db.commit()
        db.refresh(user)

        # Add genres to the user
        for genre_name in extracted_genres:
            genre = db.query(Genre).filter(Genre.name == genre_name).first()
            if genre:
                user.genres.append(genre)

        # Add books to the user
        for book_id in extracted_books:
            book = db.query(Book).filter(Book.id == book_id).first()
            if book:
                user.books.append(book)

        db.commit()

        # Suggest books based on the selected genres
        suggested_books = suggest_books_based_on_genres(db, extracted_genres)

        return {
            "message": "User onboarding successful",
            "user_data": {
                "id": user.id,
                "selected_genres": [genre.name for genre in user.genres],
                "selected_books": [
                    {
                        "id": book.id,
                        "title": book.title,
                        "author": book.author,
                        "isbn": book.isbn,
                        "publication_date": book.publication_date,
                        "summary": book.summary,
                        "genres": [genre.name for genre in book.genres],
                        "cover_image_url": book.cover_image_url
                    } for book in user.books
                ]
            },
            "suggested_books": suggested_books
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

def suggest_books_based_on_genres(db: Session, genres: List[str]) -> List[dict]:
    # Query books that have any of the selected genres
    books = (
        db.query(Book)
        .join(Book.genres)  # Join with genres relationship
        .filter(Genre.name.in_(genres))  # Filter by genre names
        .distinct()  # Avoid duplicate books
        .all()
    )

    # Format the books for the response
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
        }
        for book in books
    ]

# Add a route to get user onboarding data
@router.get("/users/{user_id}/onboarding")
async def get_user_onboarding(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(Onboarded_User).filter(Onboarded_User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "user_id": user.id,
            "selected_genres": [genre.name for genre in user.genres],
            "selected_books": [
                {
                    "id": book.id,
                    "title": book.title,
                    "author": book.author,
                    "genre": book.genre,
                    "cover_image_url": book.cover_image_url
                } for book in user.books
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    

