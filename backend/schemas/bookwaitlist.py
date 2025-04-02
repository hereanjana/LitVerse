from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from enum import Enum
from pydantic import validator

class StatusEnum(str, Enum):
    current_read = "currentRead"
    completed = "completed"
    on_hold = "onHold"
    dropped = "dropped"
    plan_to_read = "planToRead"

class BookWaitlistBase(BaseModel):
    open_library_id: str
    title: str
    author: Optional[str] = None
    cover_url: Optional[str] = None
    status: StatusEnum = StatusEnum.plan_to_read
    chapter: int = 0
    rating: Optional[int] = None
    tags: Optional[str] = None

class BookWaitlistCreate(BookWaitlistBase):
    user_id: int

class BookWaitlistUpdate(BaseModel):
    status: Optional[StatusEnum] = None
    chapter: Optional[int] = None
    finished_date: Optional[date] = None
    rating: Optional[int] = None
    tags: Optional[str] = None

    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Rating must be between 1 and 5')
        return v

class BookWaitlist(BookWaitlistBase):
    id: int
    user_id: int
    start_date: date
    finished_date: Optional[date] = None
    added_at: datetime

    class Config:
        from_attributes = True 