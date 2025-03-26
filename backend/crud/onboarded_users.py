from models.onboarded_user import Onboarded_User
from sqlalchemy.orm import Session

def save(data: Onboarded_User, db: Session):
    db.add(data)
    db.commit()
    db.refresh(data)
    
    return data