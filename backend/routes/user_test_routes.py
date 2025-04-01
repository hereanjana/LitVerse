from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.users_test import UserTest
from schemas.user_test import UserTestCreate, UserTestResponse

router = APIRouter(
    prefix="/test/users",
    tags=["test-users"]
)

@router.get("/", response_model=List[UserTestResponse])
def get_test_users(db: Session = Depends(get_db)):
    users = db.query(UserTest).all()
    return users

@router.get("/{user_id}", response_model=UserTestResponse)
def get_test_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserTest).filter(UserTest.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserTestResponse)
def create_test_user(user: UserTestCreate, db: Session = Depends(get_db)):
    db_user = UserTest(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}")
def delete_test_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserTest).filter(UserTest.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"} 