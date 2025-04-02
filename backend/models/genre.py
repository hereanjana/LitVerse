from sqlalchemy import Column, Integer, String, Boolean
from models.base import Base

class Genre(Base):
    __tablename__ = "genre"

    g_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
