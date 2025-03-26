from fastapi import FastAPI
from models.base import Base
from models.user import User
from models.onboarded_user import Onboarded_User
from models.book import Book
from routes import webhooks  # Import your routes
from routes.user_routes import router as user_router
import uvicorn

app = FastAPI()

# Include your routes
app.include_router(webhooks.router)
app.include_router(user_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to LitVerse API"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
