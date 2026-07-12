from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: str

class UserCreate(UserBase):
    password: str
    role: str  # Admin, Asset Manager, Department Head, Employee

class UserLogin(BaseModel):
    email: str
    password: str

class RoleResponse(BaseModel):
    id: int
    name: str
    permissions: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    is_active: bool
    created_at: datetime
    role: RoleResponse

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
