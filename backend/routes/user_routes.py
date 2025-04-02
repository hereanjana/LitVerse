from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from models.user import User
# from models.onboarded_user import Onboarded_User
# from crud.genres import get_genre_id
# from crud.onboarded_users import save
from database import SessionLocal, get_db
# from models.genre import Genre
# from models.book import Book
from typing import List, Optional
from models.genre import Genre 
from models.user_genre import UserGenre
from schemas.genre import GenreCreate
# from models.user_genre import UserGenre
from schemas.user_genre import UserGenreCreate
from schemas.bookwaitlist import BookWaitlistCreate, BookWaitlist, BookWaitlistUpdate
from models.bookwaitlist import BookWaitlist as BookWaitlistModel

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


@router.get("/genre/")
def read_genres(db: Session = Depends(get_db)):
    genres = db.query(Genre).all()
    return genres

@router.post("/genres/", response_model=GenreCreate)
def create_genre(genre: GenreCreate, db: Session = Depends(get_db)):
    db_genre = db.query(Genre).filter(Genre.name == genre.name).first()
    if db_genre:
        raise HTTPException(status_code=400, detail="Genre already exists")

    new_genre = Genre(name=genre.name)
    db.add(new_genre)
    db.commit()
    db.refresh(new_genre)
    return new_genre


@router.post("/user/genres/")
def select_user_genre(user_genre: UserGenreCreate, db: Session = Depends(get_db)):
    # Check if the user exists
    user = db.query(User).filter(User.id == user_genre.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the genre exists (using g_id)
    genre = db.query(Genre).filter(Genre.g_id == user_genre.genre_id).first()
    if not genre:
        raise HTTPException(status_code=400, detail=f"Genre ID {user_genre.genre_id} does not exist")

    # Store the user-genre relation
    new_user_genre = UserGenre(user_id=user_genre.user_id, genre_id=user_genre.genre_id)
    db.add(new_user_genre)
    db.commit()
    db.refresh(new_user_genre)
    
    return {"message": "User genre saved successfully!", "user_genre": new_user_genre}


@router.get("/users/{user_id}/waitlist", response_model=List[BookWaitlist])
def get_user_waitlist(user_id: int, db: Session = Depends(get_db)):
    waitlist = db.query(BookWaitlistModel).filter(BookWaitlistModel.user_id == user_id).all()
    return waitlist

@router.post("/users/{user_id}/waitlist", response_model=BookWaitlist)
def add_to_waitlist(
    user_id: int,
    book: BookWaitlistCreate,
    db: Session = Depends(get_db)
):
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if book already exists in user's waitlist
    existing_book = db.query(BookWaitlistModel).filter(
        BookWaitlistModel.user_id == user_id,
        BookWaitlistModel.open_library_id == book.open_library_id
    ).first()
    
    if existing_book:
        raise HTTPException(status_code=400, detail="Book already in waitlist")

    # Create new waitlist entry
    db_book = BookWaitlistModel(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@router.patch("/users/{user_id}/waitlist/{book_id}", response_model=BookWaitlist)
def update_waitlist_item(
    user_id: int,
    book_id: int,
    update_data: BookWaitlistUpdate,
    db: Session = Depends(get_db)
):
    # Get the book from waitlist
    book = db.query(BookWaitlistModel).filter(
        BookWaitlistModel.id == book_id,
        BookWaitlistModel.user_id == user_id
    ).first()
    
    if not book:
        raise HTTPException(status_code=404, detail="Book not found in waitlist")

    # Validate rating if provided
    if hasattr(update_data, 'rating') and update_data.rating is not None:
        if update_data.rating < 1 or update_data.rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # Update only the fields that are provided
    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(book, field, value)

    db.commit()
    db.refresh(book)
    return book

# @router.delete("/users/{user_id}/waitlist/{book_id}")
# def remove_from_waitlist(
#     user_id: int,
#     book_id: int,
#     db: Session = Depends(get_db)
# ):
#     book = db.query(BookWaitlistModel).filter(
#         BookWaitlistModel.id == book_id,
#         BookWaitlistModel.user_id == user_id
#     ).first()
    
#     if not book:
#         raise HTTPException(status_code=404, detail="Book not found in waitlist")

#     db.delete(book)
#     db.commit()
#     return {"message": "Book removed from waitlist"}

    

