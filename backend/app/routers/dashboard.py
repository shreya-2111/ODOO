# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import List
from ..schemas.dashboard import (
    DashboardStatsResponse,
    AssetUtilizationItem,
    DepartmentSummaryItem,
    MaintenanceFrequencyItem,
    BookingHeatmapItem
)
from ..services import dashboard_service
from ..dependencies import get_db, get_current_active_user
from ..models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Analytics"])

@router.get("/stats", response_model=DashboardStatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return dashboard_service.get_dashboard_stats(db)

@router.get("/analytics/utilization", response_model=List[AssetUtilizationItem])
def get_utilization(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return dashboard_service.get_analytics_utilization(db)

@router.get("/analytics/departments", response_model=List[DepartmentSummaryItem])
def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return dashboard_service.get_analytics_department_summary(db)

@router.get("/analytics/maintenance", response_model=List[MaintenanceFrequencyItem])
def get_maintenance_frequency(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return dashboard_service.get_analytics_maintenance_frequency(db)

@router.get("/analytics/bookings-heatmap", response_model=List[BookingHeatmapItem])
def get_bookings_heatmap(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return dashboard_service.get_analytics_booking_heatmap(db)
