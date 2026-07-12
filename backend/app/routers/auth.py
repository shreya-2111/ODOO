from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..schemas.user import UserCreate, UserLogin, UserResponse, Token
from ..services.auth import register_new_user, authenticate_user
from ..services.security import create_access_token
from ..dependencies import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    return register_new_user(db, user_data)

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.email, login_data.password)
    # Signs JWT token injected with the user role name for frontend dashboard renders
    access_token = create_access_token(subject=user.email, role=user.role.name)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

