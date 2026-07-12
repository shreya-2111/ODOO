# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional

class DashboardStatsResponse(BaseModel):
    assets_available: int
    assets_allocated: int
    active_bookings: int
    maintenance_today: int
    pending_transfers: int
    upcoming_returns: int

class AssetUtilizationItem(BaseModel):
    category_id: int
    category_name: str
    total_assets: int
    allocated_assets: int
    utilization_rate: float  # Percentage, e.g., 75.5

class DepartmentSummaryItem(BaseModel):
    department_id: Optional[int] = None
    department_name: str
    allocated_count: int

class MaintenanceFrequencyItem(BaseModel):
    asset_id: int
    asset_name: str
    ticket_count: int
    resolved_count: int

class BookingHeatmapItem(BaseModel):
    day_of_week: int  # 0-6 (Monday-Sunday)
    hour_of_day: int  # 0-23
    booking_count: int
