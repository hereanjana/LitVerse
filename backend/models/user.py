from sqlalchemy import Column, Integer, String, Boolean
from models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    profile_image_url = Column(String)
    is_active = Column(Boolean, default=True)
    onboarded = Column(Boolean, default=False)
    username = Column(String, unique=True, index=True)

