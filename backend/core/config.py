from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    
    # Database settings
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: str
    
    # Clerk settings
    CLERK_SECRET_KEY: str | None = None
    CLERK_PUBLISHABLE_KEY: str | None = None
    
    # Add the signing secret key field
    CLERK_WEBHOOK_SECRET: str
    
    class Config:
        env_file = ".env"

settings = Settings()
