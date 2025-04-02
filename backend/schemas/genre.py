from pydantic import BaseModel

class GenreCreate(BaseModel):
    g_id: int
    name: str

 