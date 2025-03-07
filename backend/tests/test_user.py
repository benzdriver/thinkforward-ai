# backend/app/models/__init__.py

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.dependencies import get_db
from app.database import Base
from app.models.user import UserProfile
import os

# Ensure this points to a test database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://ziyanzhou:solar92124@localhost/thinkforward_db")
engine = create_engine(DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create test client
client = TestClient(app)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Ensure this line correctly overrides the dependency
app.dependency_overrides[get_db] = override_get_db  # Adjust this line based on your actual dependency

def create_user_profile(db):
    """Helper function to create a user profile for testing."""
    user_profile = UserProfile(clerk_user_id="test_clerk_user_id", background={"data": "value"})
    db.add(user_profile)
    db.commit()
    db.refresh(user_profile)
    return user_profile

# Tests
def test_get_user_profile():
    # Setup - create a profile
    db = TestingSessionLocal()
    create_user_profile(db)
    db.close()

    # Test - retrieve the profile
    response = client.get("/profile/", headers={"Clerk-User-Id": "test_clerk_user_id"})
    assert response.status_code == 200
    assert response.json() == {"clerk_user_id": "test_clerk_user_id", "background": {"data": "value"}}

def test_update_user_profile():
    # Setup - create a profile
    db = TestingSessionLocal()
    create_user_profile(db)
    db.close()

    # Test - update the profile
    response = client.post("/profile/", json={"clerk_user_id": "test_clerk_user_id", "background": {"data": "new_value"}}, headers={"Clerk-User-Id": "test_clerk_user_id"})
    assert response.status_code == 200
    assert response.json()["background"] == {"data": "new_value"}

def test_profile_not_found():
    # Test - no profile exists
    response = client.get("/profile/", headers={"Clerk-User-Id": "non_existent_user_id"})
    assert response.status_code == 404
    assert response.json() == {"detail": "Profile not found"}
