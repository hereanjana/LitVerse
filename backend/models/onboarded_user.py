# models/onboarded_user.py

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from models.base import Base
from models.association_tables import onboarded_user_genres  # Import the table
# from models.book import onboarded_user_books

class Onboarded_User(Base):
    __tablename__ = "onboarded_users"

    id = Column(Integer, primary_key=True, index=True)
    # Use string-based reference for Genre
    genres = relationship('Genre', secondary=onboarded_user_genres, back_populates='onboarded_users')
    # Use string-based reference for Book
    # books = relationship('Book', secondary='onboarded_user_books', back_populates='onboarded_users')