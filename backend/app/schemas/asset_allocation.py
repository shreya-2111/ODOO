from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional

class AllocationCreate(BaseModel):
    asset_id: int
    employee_id: int
    department_id: Optional[int] = None
    expected_return_date: date

class AllocationReturn(BaseModel):
    return_condition_notes: str
    condition: str  # Excellent, Good, Fair, Poor (updates asset's condition!)

class AllocationResponse(BaseModel):
    id: int
    asset_id: int
    employee_id: int
    department_id: Optional[int] = None
    allocated_at: datetime
    expected_return_date: date
    returned_at: Optional[datetime] = None
    return_condition_notes: Optional[str] = None
    status: str

    model_config = ConfigDict(from_attributes=True)
