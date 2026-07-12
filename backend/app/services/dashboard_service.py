# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from typing import List, Dict
from ..models.asset import Asset
from ..models.asset_category import AssetCategory
from ..models.resource_booking import ResourceBooking
from ..models.maintenance_ticket import MaintenanceTicket
from ..models.transfer_request import TransferRequest
from ..models.asset_allocation import AssetAllocation
from ..models.department import Department
from ..schemas.dashboard import (
    DashboardStatsResponse,
    AssetUtilizationItem,
    DepartmentSummaryItem,
    MaintenanceFrequencyItem,
    BookingHeatmapItem
)

def get_dashboard_stats(db: Session) -> DashboardStatsResponse:
    # 1. Available and Allocated Assets count
    assets_available = db.query(Asset).filter(Asset.status == "Available").count()
    assets_allocated = db.query(Asset).filter(Asset.status == "Allocated").count()

    # 2. Active bookings count
    active_bookings = db.query(ResourceBooking).filter(
        ResourceBooking.status.in_(["Upcoming", "Ongoing"])
    ).count()

    # 3. Active or today's maintenance count
    today_start = datetime.combine(date.today(), datetime.min.time())
    maintenance_today = db.query(MaintenanceTicket).filter(
        (MaintenanceTicket.created_at >= today_start) | 
        (MaintenanceTicket.status == "In Progress")
    ).count()

    # 4. Pending transfers count
    pending_transfers = db.query(TransferRequest).filter(
        TransferRequest.status == "Requested"
    ).count()

    # 5. Upcoming returns count (within 7 days)
    target_date = date.today() + timedelta(days=7)
    upcoming_returns = db.query(AssetAllocation).filter(
        AssetAllocation.returned_at.is_(None),
        AssetAllocation.expected_return_date >= date.today(),
        AssetAllocation.expected_return_date <= target_date
    ).count()

    return DashboardStatsResponse(
        assets_available=assets_available,
        assets_allocated=assets_allocated,
        active_bookings=active_bookings,
        maintenance_today=maintenance_today,
        pending_transfers=pending_transfers,
        upcoming_returns=upcoming_returns
    )

def get_analytics_utilization(db: Session) -> List[AssetUtilizationItem]:
    categories = db.query(AssetCategory).all()
    results = []
    
    for cat in categories:
        total_count = db.query(Asset).filter(Asset.category_id == cat.id).count()
        allocated_count = db.query(Asset).filter(
            Asset.category_id == cat.id,
            Asset.status == "Allocated"
        ).count()
        
        util_rate = 0.0
        if total_count > 0:
            util_rate = round((allocated_count / total_count) * 100.0, 2)
            
        results.append(AssetUtilizationItem(
            category_id=cat.id,
            category_name=cat.name,
            total_assets=total_count,
            allocated_assets=allocated_count,
            utilization_rate=util_rate
        ))
        
    return results

def get_analytics_department_summary(db: Session) -> List[DepartmentSummaryItem]:
    departments = db.query(Department).all()
    results = []
    
    for dept in departments:
        count = db.query(AssetAllocation).filter(
            AssetAllocation.department_id == dept.id,
            AssetAllocation.returned_at.is_(None)
        ).count()
        
        results.append(DepartmentSummaryItem(
            department_id=dept.id,
            department_name=dept.name,
            allocated_count=count
        ))
        
    return results

def get_analytics_maintenance_frequency(db: Session) -> List[MaintenanceFrequencyItem]:
    assets = db.query(Asset).all()
    results = []
    
    for asset in assets:
        ticket_count = db.query(MaintenanceTicket).filter(
            MaintenanceTicket.asset_id == asset.id
        ).count()
        
        resolved_count = db.query(MaintenanceTicket).filter(
            MaintenanceTicket.asset_id == asset.id,
            MaintenanceTicket.status == "Resolved"
        ).count()
        
        if ticket_count > 0:
            results.append(MaintenanceFrequencyItem(
                asset_id=asset.id,
                asset_name=asset.name,
                ticket_count=ticket_count,
                resolved_count=resolved_count
            ))
            
    results.sort(key=lambda x: x.ticket_count, reverse=True)
    return results[:10]

def get_analytics_booking_heatmap(db: Session) -> List[BookingHeatmapItem]:
    bookings = db.query(ResourceBooking).filter(
        ResourceBooking.status != "Cancelled"
    ).all()
    
    heatmap: Dict[tuple, int] = {}
    for b in bookings:
        dow = b.start_time.weekday()  # Monday is 0, Sunday is 6
        hour = b.start_time.hour      # 0 to 23
        key = (dow, hour)
        heatmap[key] = heatmap.get(key, 0) + 1
        
    results = []
    for (dow, hour), count in heatmap.items():
        results.append(BookingHeatmapItem(
            day_of_week=dow,
            hour_of_day=hour,
            booking_count=count
        ))
        
    return results
