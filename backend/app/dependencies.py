# dependencies.py

from fastapi import Depends, HTTPException, Request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from clerk_backend_api import Clerk, UnauthorizedError
from dotenv import load_dotenv
import os

# Database configuration
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./fallback.db")
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}  # Only necessary for SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency for database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize Clerk
clerk = Clerk()  # Make sure CLERK_API_KEY is set in environment variables

# Dependency to extract and verify Clerk session
def get_current_clerk_user(request: Request):
    session_token = request.headers.get("Authorization")
    if not session_token:
        raise HTTPException(status_code=401, detail="Authorization token is missing")
    try:
        session = clerk.verify_session(session_token)
        return session.user_id  # Returns user_id associated with the session
    except UnauthorizedError:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")

# Example RBAC dependency
def require_admin(user_id: str = Depends(get_current_clerk_user)):
    # This example assumes you have a way to get a user object from your database
    # Here, `get_user_from_database` is a mock function you would replace with actual logic
    user = get_user_from_database(user_id)
    if user.role != 'admin':
        raise HTTPException(status_code=403, detail="Access denied")
    return user

def get_user_from_database(user_id: str):
    # Placeholder function to simulate fetching a user from the database
    # You would replace this with actual query logic to your database
    return {'user_id': user_id, 'role': 'admin'}  # Example user object
