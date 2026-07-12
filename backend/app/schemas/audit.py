from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional, List

class AuditCycleCreate(BaseModel):
    name: str
    start_date: date
    end_date: date
    auditor_id: int

class AuditCycleResponse(BaseModel):
    id: int
    name: str
    start_date: date
    end_date: date
    auditor_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AuditVerifyItem(BaseModel):
    verification_status: str  # Verified, Missing, Damaged
    verification_notes: Optional[str] = None

class AuditItemResponse(BaseModel):
    id: int
    audit_cycle_id: int
    asset_id: int
    verification_status: str
    verification_notes: Optional[str] = None
    verified_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class DiscrepancyReportResponse(BaseModel):
    audit_cycle_id: int
    missing_count: int
    damaged_count: int
    discrepancies: List[AuditItemResponse]

    model_config = ConfigDict(from_attributes=True)
