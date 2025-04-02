from fastapi import FastAPI
from models.base import Base
from models.user import User
from models.genre import Genre
# from models.onboarded_user import Onboarded_User
# from models.book import Book
from routes import webhooks # Import your routes
from routes.user_routes import router as user_router

from fastapi.middleware.cors import CORSMiddleware
# from routes.populate import router as populate_router
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routes
app.include_router(webhooks.router)
app.include_router(user_router)
# app.include_router(genre_router)
# app.include_router(populate_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to LitVerse API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

