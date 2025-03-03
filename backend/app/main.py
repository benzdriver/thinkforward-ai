from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import logging
from sqlalchemy.orm import Session
from .database import get_db
from .models import UserProfile

# Import Clerk SDK
from clerk_backend_api import Clerk

# Import API routes
from app.api.user import router as user_router
from app.api.ai import router as ai_router
from app.api.form import router as form_router

# Initialize Clerk with your Clerk API key (ensure this is set in your environment variables)
clerk = Clerk()

# Create a dependency to authenticate users
def get_current_user(session_token: str = Header(None)):
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Remove "Bearer" if it's part of the session token
        session = clerk.sessions.verify_session(session_token.replace("Bearer ", ""))
        return session.user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid session token") from e

async def get_or_create_user_profile(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        # Create a new profile if one doesn't exist
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        db.commit()
    return profile

# Initialize FastAPI app with a title
app = FastAPI(title="ThinkForward API", debug=True)

# Enable logging for debugging
logging.basicConfig(level=logging.DEBUG)

# CORS Middleware (Required if frontend & backend run on different domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes with authentication
app.include_router(user_router, prefix="/user", tags=["User"], dependencies=[Depends(get_current_user)])
app.include_router(ai_router, prefix="/ai", tags=["AI"], dependencies=[Depends(get_current_user)])
app.include_router(form_router, prefix="/form", tags=["Form"], dependencies=[Depends(get_current_user)])

# Root health check endpoint
@app.get("/", tags=["Health Check"])
def root():
    return {"message": "ThinkForward API is running 🚀"}

# Handle unhandled exceptions for better debugging
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logging.error(f"Unhandled error: {exc}")
    return {"error": "An unexpected error occurred. Please try again."}
