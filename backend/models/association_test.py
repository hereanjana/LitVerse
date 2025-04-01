from sqlalchemy import Table, Column, Integer, ForeignKey
from models.base import Base

# Many-to-Many: Users ↔ Books (Tracks user selections)
user_book_test = Table(
    'user_book_test',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users_test.id'), primary_key=True),
    Column('book_id', Integer, ForeignKey('books_test.id'), primary_key=True)
)
