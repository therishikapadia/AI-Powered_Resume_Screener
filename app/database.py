from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Database URL: {DATABASE_URL}")

try:
    print("Attempting to create engine...")
    engine = create_engine(DATABASE_URL)
    print("Engine created successfully. Attempting to connect...")
    connection = engine.connect()
    print("Connection to database successful.")
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    connection.close()
except Exception as e:
    print(f"Database connection failed: {e}")

__all__ = ["Base", "engine", "SessionLocal"]
