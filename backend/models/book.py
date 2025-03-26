# models/book.py

from sqlalchemy import Column, Integer, String, ForeignKey, Table, Date
from sqlalchemy.orm import relationship
from models.base import Base

# Association table for many-to-many relationship
onboarded_user_books = Table(
    'onboarded_user_books',
    Base.metadata,
    Column('onboarded_user_id', Integer, ForeignKey('onboarded_users.id'), primary_key=True),
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True)
)

# Association table for book-genre relationship
book_genres = Table(
    'book_genres',
    Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
    Column('genre_id', Integer, ForeignKey('genres.id'), primary_key=True)
)

class Book(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    author = Column(String, nullable=False, index=True)
    isbn = Column(String, unique=True, index=True)
    publication_date = Column(Date, nullable=True)
    summary = Column(String, nullable=True)
    cover_image_url = Column(String, nullable=True)

    # Use string-based reference for Onboarded_User
    onboarded_users = relationship('Onboarded_User', secondary=onboarded_user_books, back_populates='books')
    
    # Relationship with genres
    genres = relationship("Genre", secondary=book_genres, back_populates="books")
    