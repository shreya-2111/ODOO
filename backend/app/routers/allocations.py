# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from ..schemas.asset_allocation import AllocationCreate, AllocationReturn, AllocationResponse
from ..models.asset_allocation import AssetAllocation
from ..models.asset import Asset
from ..models.user import User
from ..dependencies import get_db, get_current_active_user
from ..services.notification_service import create_notification
from ..services.activity_log_service import log_activity

router = APIRouter(prefix="/allocations", tags=["Asset Allocation"])

@router.post("", response_model=AllocationResponse, status_code=status.HTTP_201_CREATED)
def allocate_asset(
    alloc_in: AllocationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify asset existence
    asset = db.query(Asset).filter(Asset.id == alloc_in.asset_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found.")

    # Rule: Check if asset is already allocated (conflict check)
    active_alloc = db.query(AssetAllocation).filter(
        AssetAllocation.asset_id == alloc_in.asset_id,
        AssetAllocation.returned_at.is_(None)
    ).first()
    
    if active_alloc or asset.status == "Allocated":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Conflict: Asset is already allocated. A Transfer Request is required to reallocate."
        )

    # Verify employee existence
    employee = db.query(User).filter(User.id == alloc_in.employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target employee not found.")

    # Create allocation record
    new_alloc = AssetAllocation(
        asset_id=alloc_in.asset_id,
        employee_id=alloc_in.employee_id,
        department_id=alloc_in.department_id,
        expected_return_date=alloc_in.expected_return_date,
        status="Active"
    )
    db.add(new_alloc)

    # Update asset status to Allocated
    asset.status = "Allocated"
    
    db.commit()
    db.refresh(new_alloc)

    # Activity Log
    log_activity(db, current_user.id, "Create Allocation", "AssetAllocation", new_alloc.id)

    # Notification for employee
    create_notification(
        db,
        alloc_in.employee_id,
        "Asset Assigned",
        "Asset Assigned",
        f"Asset '{asset.name}' has been assigned to you. Expected return date is {alloc_in.expected_return_date}."
    )

    return new_alloc

@router.get("", response_model=List[AllocationResponse])
def list_allocations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(AssetAllocation).all()

@router.post("/{id}/return", response_model=AllocationResponse)
def return_asset(
    id: int,
    return_in: AllocationReturn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    alloc = db.query(AssetAllocation).filter(AssetAllocation.id == id).first()
    if not alloc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Allocation record not found.")

    if alloc.returned_at is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Asset has already been returned.")

    # Update allocation check-in timestamps and notes
    alloc.returned_at = datetime.utcnow()
    alloc.return_condition_notes = return_in.return_condition_notes
    alloc.status = "Returned"

    # Reset asset status to Available and record check-in condition notes
    asset = db.query(Asset).filter(Asset.id == alloc.asset_id).first()
    if asset:
        asset.status = "Available"
        asset.condition = return_in.condition

    # Check if return is overdue
    is_overdue = datetime.utcnow().date() > alloc.expected_return_date

    db.commit()
    db.refresh(alloc)

    # Activity Log
    log_activity(db, current_user.id, "Return Asset", "AssetAllocation", alloc.id)

    # Overdue notification if applicable
    if is_overdue and asset:
        create_notification(
            db,
            alloc.employee_id,
            "Overdue Return",
            "Overdue Return Warning",
            f"Asset '{asset.name}' was returned after its expected return date ({alloc.expected_return_date})."
        )

    return alloc

