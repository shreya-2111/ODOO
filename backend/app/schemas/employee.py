from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class EmployeeCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role_id: int
    department_id: Optional[int] = None

class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role_id: Optional[int] = None
    department_id: Optional[int] = None
    is_active: Optional[bool] = None

class EmployeeRoleResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class EmployeeDeptResponse(BaseModel):
    id: int
    name: str
    code: str

    model_config = ConfigDict(from_attributes=True)

class EmployeeResponse(BaseModel):
    id: int
    full_name: str
    email: str
    is_active: bool
    created_at: datetime
    role: EmployeeRoleResponse
    department: Optional[EmployeeDeptResponse] = None

    model_config = ConfigDict(from_attributes=True)
