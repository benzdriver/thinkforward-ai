# /app/api/user.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..dependencies import get_db, get_current_clerk_user
from ..models.user import UserProfile
from ..schemas.user_schema import UserProfileSchema 

router = APIRouter()

@router.get("/profile/", response_model=UserProfileSchema)
def get_user_profile(db: Session = Depends(get_db), clerk_user_id: str = Depends(get_current_clerk_user)):
    profile = db.query(UserProfile).filter(UserProfile.clerk_user_id == clerk_user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.post("/profile/", response_model=UserProfileSchema)
def update_user_profile(profile_data: UserProfileSchema, db: Session = Depends(get_db), clerk_user_id: str = Depends(get_current_clerk_user)):
    profile = db.query(UserProfile).filter(UserProfile.clerk_user_id == clerk_user_id).first()
    if profile:
        profile.background = profile_data.dict()
    else:
        profile = UserProfile(clerk_user_id=clerk_user_id, background=profile_data.dict())
        db.add(profile)
    db.commit()
    return profile

@router.post("/update-subscription/")
async def update_subscription(is_subscribed: bool, db: Session = Depends(get_db), user_id: int = Depends(get_current_clerk_user)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if profile:
        profile.is_subscribed = is_subscribed
        db.commit()
        return {"status": "Subscription status updated"}
    else:
        raise HTTPException(status_code=404, detail="User profile not found")