from sqlalchemy import Column, Integer, String, Text, Boolean, Date, ForeignKey, Table
from sqlalchemy.orm import relationship

from models.base import Base

# Association table for many-to-many relationship between books and subjects/genres
book_subject = Table(
    'book_subject',
    Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
    Column('subject_id', Integer, ForeignKey('subjects.id'), primary_key=True)
)

# Association table for many-to-many relationship between books and authors
book_author = Table(
    'book_author',
    Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
    Column('author_id', Integer, ForeignKey('authors.id'), primary_key=True)
)

class Book(Base):
    __tablename__ = 'books'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)

    isbn = Column(String(20), unique=True, index=True, nullable=True)
    cover_id = Column(Integer, nullable=True)
    cover_edition_key = Column(String(50), nullable=True)
    first_publish_year = Column(Integer, nullable=True)
    edition_count = Column(Integer, nullable=True)
    open_library_key = Column(String(50), unique=True, nullable=True)
    
    # Availability information
    is_readable = Column(Boolean, default=False)
    is_lendable = Column(Boolean, default=False)
    is_previewable = Column(Boolean, default=False)
    
    # Relationships
    authors = relationship("Author", secondary=book_author, back_populates="books")
    subjects = relationship("Subject", secondary=book_subject, back_populates="books")

class Author(Base):
    __tablename__ = 'authors'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    open_library_key = Column(String(50), unique=True, nullable=True)
    
    # Relationship
    books = relationship("Book", secondary=book_author, back_populates="authors")

class Subject(Base):
    __tablename__ = 'subjects'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    
    # Relationship
    books = relationship("Book", secondary=book_subject, back_populates="subjects")