from pydantic import BaseModel

class UserGenreCreate(BaseModel):
    user_id: int
    genre_id: int

