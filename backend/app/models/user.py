# /app/models/user.py

from sqlalchemy import Column, String, JSON, Boolean, DateTime
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class UserProfile(Base):
    __tablename__ = 'user_profiles'
    clerk_user_id = Column(String, primary_key=True)  # Use Clerk's user ID as the primary key
    background = Column(JSON)  # Stores all user-specific data as JSON
    is_subscribed = Column(Boolean, default=False)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<UserProfile(clerk_user_id='{self.clerk_user_id}')>"
