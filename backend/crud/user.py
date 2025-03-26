from typing import Optional
from sqlalchemy.orm import Session
from crud.base import CRUDBase
from models.user import User
from schemas.user import UserCreate, UserUpdate
from pydantic import HttpUrl

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_clerk_id(self, db: Session, *, clerk_id: str) -> Optional[User]:
        return db.query(User).filter(User.clerk_id == clerk_id).first()

    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def update(self, db: Session, *, db_obj: User, obj_in: UserUpdate) -> User:
        update_data = obj_in.dict(exclude_unset=True)
        if "profile_image_url" in update_data and isinstance(update_data["profile_image_url"], HttpUrl):
            update_data["profile_image_url"] = str(update_data["profile_image_url"])
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

user_crud = CRUDUser(User)
