from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class TransferCreate(BaseModel):
    asset_id: int
    target_employee_id: int
    target_department_id: Optional[int] = None

class TransferResponse(BaseModel):
    id: int
    asset_id: int
    source_employee_id: int
    target_employee_id: int
    target_department_id: Optional[int] = None
    requested_by_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
