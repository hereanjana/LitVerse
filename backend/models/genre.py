from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from models.base import Base
from models.association_tables import onboarded_user_genres  # Import the table
from models.book import book_genres

class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    # Back reference to Onboarded_User
    onboarded_users = relationship('Onboarded_User', secondary=onboarded_user_genres, back_populates='genres')

    # Relationship with books
    books = relationship("Book", secondary=book_genres, back_populates="genres")
