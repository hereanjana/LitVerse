from sqlalchemy import Column, Integer, String, Boolean
from models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    username = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    onboarded = Column(Boolean, default=False)