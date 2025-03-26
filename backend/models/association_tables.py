from sqlalchemy import Table, Column, Integer, ForeignKey
from models.base import Base

# Association table for many-to-many relationship
onboarded_user_genres = Table(
    'onboarded_user_genres',
    Base.metadata,
    Column('onboarded_user_id', Integer, ForeignKey('onboarded_users.id'), primary_key=True),
    Column('genre_id', Integer, ForeignKey('genres.id'), primary_key=True)
)
