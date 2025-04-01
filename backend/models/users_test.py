from sqlalchemy import Column, Integer, String
from models.base import Base

class UserTest(Base):
    __tablename__ = 'users_test'
    
    id = Column(Integer, primary_key=True, index=True)
    clerk_user_id = Column(String(255), unique=True, nullable=False)  # Clerk's unique ID
    username = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    
    # No relationships needed for test users