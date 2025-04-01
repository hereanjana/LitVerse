from fastapi import FastAPI
from routes import user_test_routes

app = FastAPI()

# Only include the test routes
app.include_router(user_test_routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to LitVerse API"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
