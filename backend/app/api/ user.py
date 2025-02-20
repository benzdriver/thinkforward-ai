from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User

router = APIRouter()

@router.get("/")
def get_users():
    return {"message": "User API is working"}

@router.post("/register")
def register_user(name: str, email: str, password: str, db: Session = Depends(get_db)):
    new_user = User(name=name, email=email, password=password)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}
