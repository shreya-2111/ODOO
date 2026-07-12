from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class TicketCreate(BaseModel):
    asset_id: int
    description: str
    priority: Optional[str] = "Medium"  # Low, Medium, High, Critical
    image_url: Optional[str] = None

class TicketAssign(BaseModel):
    technician_id: int

class TicketUpdateStatus(BaseModel):
    status: str  # Pending, Approved, Rejected, Technician Assigned, In Progress, Resolved

class TicketResponse(BaseModel):
    id: int
    asset_id: int
    description: str
    priority: str
    image_url: Optional[str] = None
    technician_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
