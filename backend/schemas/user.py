from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image_url: Optional[str] = None
    username: Optional[str] = None

class UserCreate(BaseModel):
    clerk_id: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image_url: Optional[str] = None
    username: Optional[str] = None

class UserUpdate(UserBase):
    pass

class UserResponse(UserBase):
    id: str
    clerk_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserOnboardingSchema(BaseModel):
    genres: List[str]
    books: List[int] #remove after onboarding milaira

