from sqlalchemy import Column, Integer, String
from models.base import Base

class Genre(Base):
    __tablename__ = 'genres'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
