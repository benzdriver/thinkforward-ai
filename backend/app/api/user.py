from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db
from app.models.user import User
from app.services.auth import hash_password, verify_password
from app.services.token import create_access_token, get_current_user
from app.services.oauth import oauth
from pydantic import BaseModel, EmailStr

router = APIRouter()

# ✅ User Signup (Regular Email/Password)
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

# ✅ User Login (Regular Email/Password)
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# ✅ Get Current User (Protected Route)
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"name": current_user.name, "email": current_user.email}

# ✅ Google Login Route
@router.get("/login/google")
async def login_google(request: Request):
    redirect_uri = request.url_for("auth_google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google")
async def auth_google_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")
    return await handle_oauth_login(user_info, db)

# ✅ GitHub Login Route
@router.get("/login/github")
async def login_github(request: Request):
    redirect_uri = request.url_for("auth_github_callback")
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/auth/github")
async def auth_github_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.github.authorize_access_token(request)
    user_info = await oauth.github.get("user", token=token)
    return await handle_oauth_login(user_info.json(), db)

# ✅ Microsoft Login Route
@router.get("/login/microsoft")
async def login_microsoft(request: Request):
    redirect_uri = request.url_for("auth_microsoft_callback")
    return await oauth.microsoft.authorize_redirect(request, redirect_uri)

@router.get("/auth/microsoft")
async def auth_microsoft_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.microsoft.authorize_access_token(request)
    user_info = await oauth.microsoft.get("openid/userinfo", token=token)
    return await handle_oauth_login(user_info.json(), db)

# ✅ Common OAuth Handler (Google, GitHub, Microsoft)
async def handle_oauth_login(user_info, db: Session):
    email = user_info.get("email")
    name = user_info.get("name", "No Name")

    if not email:
        raise HTTPException(status_code=400, detail="Email not found in OAuth response")

    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Create a new user
        user = User(name=name, email=email, is_active=True)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate JWT token
    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
