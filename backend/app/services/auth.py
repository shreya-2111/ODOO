from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..models.user import User
from ..models.role import Role
from ..schemas.user import UserCreate
from .security import hash_password, verify_password

def get_or_create_role(db: Session, role_name: str) -> Role:
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        # Default permissions assigned to each of the 4 user roles
        permissions_map = {
            "Admin": "all",
            "Asset Manager": "read,write,allocate,audit",
            "Department Head": "read,booking",
            "Employee": "read,booking,maintenance"
        }
        permissions = permissions_map.get(role_name, "read")
        role = Role(name=role_name, permissions=permissions)
        db.add(role)
        db.commit()
        db.refresh(role)
    return role

def register_new_user(db: Session, user_data: UserCreate) -> User:
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Fetch/create role ID binding
    role_obj = get_or_create_role(db, user_data.role)

    # Hash user password
    hashed_pwd = hash_password(user_data.password)

    # Create new database user record
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_pwd,
        role_id=role_obj.id,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, email: str, plain_pass: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    
    if not verify_password(plain_pass, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This user account has been deactivated."
        )
        
    return user
