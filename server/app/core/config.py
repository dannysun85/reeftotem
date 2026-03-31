from pydantic_settings import BaseSettings
from typing import List, Union, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "ReefTotem Backend"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173", 
        "http://localhost:3000",
        "http://localhost:5174", # Admin
        "https://reeftotem.ai",
        "https://www.reeftotem.ai",
        "https://admin.reeftotem.ai",
        # Add Vercel preview domains if needed
        "https://reeftotem-client.vercel.app",
        "https://reeftotem-admin.vercel.app"
    ]

    # Database
    # Default to SQLite for development, can be overridden by env var or DATABASE_URL
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./reeftotem.db"
    
    # JWT
    SECRET_KEY: str = "CHANGE_THIS_TO_A_SECURE_SECRET_KEY_IN_PRODUCTION" # TODO: generate a secure key
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    class Config:
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Prioritize DATABASE_URL env var (common on PaaS)
        database_url = os.getenv("DATABASE_URL")
        if database_url:
            # Fix for SQLAlchemy: postgres:// -> postgresql://
            if database_url.startswith("postgres://"):
                database_url = database_url.replace("postgres://", "postgresql://", 1)
            self.SQLALCHEMY_DATABASE_URI = database_url

settings = Settings()
