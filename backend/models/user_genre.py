from sqlalchemy import Column, Integer, ForeignKey
from models.base import Base

class UserGenre(Base):
    __tablename__ = "user_genres"
    id = Column(Integer, primary_key=True,index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"),nullable=False)
    genre_id = Column(Integer, ForeignKey("genre.g_id", ondelete="CASCADE"),nullable=False)