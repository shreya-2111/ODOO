from pydantic import BaseModel, ConfigDict
from typing import Optional

class DepartmentBase(BaseModel):
    name: str
    code: str
    parent_id: Optional[int] = None
    head_id: Optional[int] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[int] = None
    head_id: Optional[int] = None
    is_active: Optional[bool] = None

class DepartmentResponse(DepartmentBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
