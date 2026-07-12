# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status 
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from typing import List
from ..schemas.transfer_request import TransferCreate, TransferResponse
from ..models.transfer_request import TransferRequest
from ..models.asset_allocation import AssetAllocation
from ..models.asset import Asset
from ..models.user import User
from ..dependencies import get_db, get_current_active_user
from ..services.notification_service import create_notification
from ..services.activity_log_service import log_activity

router = APIRouter(prefix="/transfers", tags=["Transfer Requests"])

@router.post("", response_model=TransferResponse, status_code=status.HTTP_201_CREATED)
def create_transfer_request(
    transfer_in: TransferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify asset exists
    asset = db.query(Asset).filter(Asset.id == transfer_in.asset_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found.")

    # Find active allocation to identify source holder
    active_alloc = db.query(AssetAllocation).filter(
        AssetAllocation.asset_id == transfer_in.asset_id,
        AssetAllocation.returned_at.is_(None)
    ).first()

    if not active_alloc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot transfer an unallocated asset. Please allocate it directly using the allocation module."
        )

    # Verify target employee
    target_emp = db.query(User).filter(User.id == transfer_in.target_employee_id).first()
    if not target_emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target employee not found.")

    # Create transfer request
    new_transfer = TransferRequest(
        asset_id=transfer_in.asset_id,
        source_employee_id=active_alloc.employee_id,
        target_employee_id=transfer_in.target_employee_id,
        target_department_id=transfer_in.target_department_id,
        requested_by_id=current_user.id,
        status="Requested"
    )
    db.add(new_transfer)
    db.commit()
    db.refresh(new_transfer)

    # Activity Log
    log_activity(db, current_user.id, "Create Transfer Request", "TransferRequest", new_transfer.id)

    return new_transfer

@router.get("", response_model=List[TransferResponse])
def list_transfers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(TransferRequest).all()

@router.post("/{id}/approve", response_model=TransferResponse)
def approve_transfer_request(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    transfer = db.query(TransferRequest).filter(TransferRequest.id == id).first()
    if not transfer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transfer request not found.")

    if transfer.status != "Requested":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Transfer request is in status '{transfer.status}' and cannot be approved."
        )

    # Begin allocation transfer transitions
    transfer.status = "Approved"

    # 1. Close current active allocation
    active_alloc = db.query(AssetAllocation).filter(
        AssetAllocation.asset_id == transfer.asset_id,
        AssetAllocation.returned_at.is_(None)
    ).first()

    if active_alloc:
        active_alloc.returned_at = datetime.utcnow()
        active_alloc.return_condition_notes = f"Closed via transfer approval ID: {transfer.id}"
        active_alloc.status = "Returned"

    # 2. Create new allocation
    new_alloc = AssetAllocation(
        asset_id=transfer.asset_id,
        employee_id=transfer.target_employee_id,
        department_id=transfer.target_department_id,
        expected_return_date=date.today() + timedelta(days=30),  # Default 30 days projection
        status="Active"
    )
    db.add(new_alloc)

    # 3. Ensure Asset table status remains Allocated
    asset = db.query(Asset).filter(Asset.id == transfer.asset_id).first()
    if asset:
        asset.status = "Allocated"

    # 4. Finalize transfer request status to Reallocated
    transfer.status = "Reallocated"
    
    db.commit()
    db.refresh(transfer)

    # Activity Log
    log_activity(db, current_user.id, "Approve Transfer Request", "TransferRequest", transfer.id)

    # Notification for target employee
    if asset:
        create_notification(
            db,
            transfer.target_employee_id,
            "Transfer Approved",
            "Transfer Approved",
            f"Transfer request for asset '{asset.name}' has been approved. It is now assigned to you."
        )

    return transfer

