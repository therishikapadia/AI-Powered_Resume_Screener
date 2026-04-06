from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Database URL: {DATABASE_URL}")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

try:
    print("Attempting to connect to database...")
    with engine.connect() as connection:
        print("Connection to database successful.")
except Exception as e:
    print(f"Database connection check failed: {e}")

__all__ = ["Base", "engine", "SessionLocal"]
