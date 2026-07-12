# pyrefly: ignore [missing-import]
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class BookingCreate(BaseModel):
    resource_id: int
    employee_id: int
    start_time: datetime
    end_time: datetime

class BookingUpdate(BaseModel):
    status: Optional[str] = None  # Upcoming, Ongoing, Completed, Cancelled

class BookingResponse(BaseModel):
    id: int
    resource_id: int
    employee_id: int
    start_time: datetime
    end_time: datetime
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
