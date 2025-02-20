from fastapi import FastAPI
import sys
import os

# Fix the Python path issue
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.api.user import router as user_router
from app.api.ai import router as ai_router
from app.api.form import router as form_router


app = FastAPI(title="ThinkForward API")

# Include API routes
app.include_router(user_router, prefix="/user")
app.include_router(ai_router, prefix="/ai")
app.include_router(form_router, prefix="/form")

@app.get("/")
def root():
    return {"message": "ThinkForward API is running"}

