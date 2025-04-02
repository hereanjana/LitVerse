from typing import List, Dict
from sqlalchemy.orm import Session
# from models.book import Book
# from models.onboarded_user import Onboarded_User

def hybrid_recommendation(db: Session, user_id: int) -> List[Dict]:
    # Get the user's selected genres
    user = db.query(Onboarded_User).filter(Onboarded_User.id == user_id).first()
    if not user:
        return []

    genres = [genre.name for genre in user.genres]

    # Content-based filtering: Recommend books based on genres
    content_based_books = db.query(Book).filter(Book.genre.in_(genres)).all()

    # Collaborative filtering: Recommend books based on similar users
    # (This is a placeholder; you would need to implement this logic)
    collaborative_books = []

    # Combine the results
    recommended_books = content_based_books + collaborative_books

    # Remove duplicates
    unique_books = list({book.id: book for book in recommended_books}.values())

    # Format the books for the response
    return [
        {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "cover_image_url": book.cover_image_url
        }
        for book in unique_books
    ]
