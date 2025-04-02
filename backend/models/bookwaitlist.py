from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, Enum, ForeignKey, CheckConstraint
from datetime import datetime
from models.base import Base

class BookWaitlist(Base):
    __tablename__ = "book_waitlist"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    open_library_id = Column(String(50), nullable=False)  # Open Library Book ID
    title = Column(String(255), nullable=False)
    author = Column(String(255))
    cover_url = Column(String(255))
    rating = Column(Integer, CheckConstraint('rating >= 1 AND rating <= 5'), nullable=True)  # New: rating field
    tags = Column(String(255), nullable=True)  # New: tags field

    status = Column(Enum("currentRead", "completed", "onHold", "dropped", "planToRead", name="status_enum"), default="planToRead")
    chapter = Column(Integer, default=0)
    start_date = Column(Date, default=datetime.utcnow)
    finished_date = Column(Date, nullable=True)

    added_at = Column(DateTime, default=datetime.utcnow)