from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

# 🔹 Secret key for JWT encoding/decoding
SECRET_KEY = "your_secret_key"  # Change this to a secure key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Token expiration time

# 🔹 OAuth2 scheme for handling token-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")


#  **Function to create an access token (JWT)**
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    
    # Set expiration time
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    
    # Encode and return the JWT
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


#  **Function to verify and decode JWT token**
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")  # Extract user email from token
        if user_email is None:
            raise credentials_exception
        
        # Fetch user from database
        user = db.query(User).filter(User.email == user_email).first()
        if user is None:
            raise credentials_exception

        return user

    except JWTError:
        raise credentials_exception


#  **Function to require admin access for specific routes**
def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Admins only"
        )
    return current_user
