from sqlalchemy.orm import Session
from models.genre import Genre

def get_genre_id(genre_name: str, db: Session):
    status = db.query(Genre).filter(genre_name == Genre.name)
    if status:
        genre_id = status.get("id")

    return genre_id