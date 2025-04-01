from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from models.base import Base
from models.association_test import user_book_test

class BookTest(Base):
    __tablename__ = 'books_test'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    isbn = Column(String(20), index=True, nullable=True)
    cover_id = Column(Integer, nullable=True)
    first_publish_year = Column(Integer, nullable=True)
    open_library_key = Column(String(50), unique=True, nullable=False)  # Ensures each book is stored only once
    
    # Only reference UserTest relationship
    users = relationship("UserTest", secondary=user_book_test, back_populates="selected_books")
