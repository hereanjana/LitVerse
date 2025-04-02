from typing import Optional
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate, UserUpdate
from .base import CRUDBase

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_by_clerk_id(self, db: Session, *, clerk_id: str) -> Optional[User]:
        return db.query(User).filter(User.clerk_id == clerk_id).first()

user_crud = CRUDUser(User) 