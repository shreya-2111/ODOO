# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status 
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session 
from datetime import datetime
from typing import List
from ..schemas.audit import AuditCycleCreate, AuditCycleResponse, AuditVerifyItem, AuditItemResponse, DiscrepancyReportResponse
from ..models.audit_cycle import AuditCycle
from ..models.audit_item import AuditItem
from ..models.asset import Asset
from ..models.user import User
from ..dependencies import get_db, get_current_active_user
from ..services.notification_service import create_notification
from ..services.activity_log_service import log_activity

router = APIRouter(tags=["Audit Management"])

@router.post("/audit-cycles", response_model=AuditCycleResponse, status_code=status.HTTP_201_CREATED)
def create_audit_cycle(
    cycle_in: AuditCycleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if cycle_in.start_date >= cycle_in.end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Start date must be before end date.")

    # Verify auditor exists
    auditor = db.query(User).filter(User.id == cycle_in.auditor_id).first()
    if not auditor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assigned auditor not found.")

    new_cycle = AuditCycle(
        name=cycle_in.name,
        start_date=cycle_in.start_date,
        end_date=cycle_in.end_date,
        auditor_id=cycle_in.auditor_id,
        status="Draft"
    )
    db.add(new_cycle)
    db.commit()
    db.refresh(new_cycle)

    # Automatically generate AuditItem records for ALL registered assets
    assets = db.query(Asset).all()
    for asset in assets:
        audit_item = AuditItem(
            audit_cycle_id=new_cycle.id,
            asset_id=asset.id,
            verification_status="Pending",
            verification_notes=None
        )
        db.add(audit_item)
    db.commit()
    
    # Activity Log
    log_activity(db, current_user.id, "Create Audit Cycle", "AuditCycle", new_cycle.id)

    return new_cycle

@router.get("/audit-cycles", response_model=List[AuditCycleResponse])
def list_audit_cycles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(AuditCycle).all()

@router.get("/audit-cycles/{id}/items", response_model=List[AuditItemResponse])
def list_audit_items(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    cycle = db.query(AuditCycle).filter(AuditCycle.id == id).first()
    if not cycle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit cycle not found.")
    return db.query(AuditItem).filter(AuditItem.audit_cycle_id == id).all()

@router.post("/audit-items/{item_id}/verify", response_model=AuditItemResponse)
def verify_audit_item(
    item_id: int,
    verify_in: AuditVerifyItem,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    item = db.query(AuditItem).filter(AuditItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit item not found.")

    # Rule: Lock check if parent cycle is Closed
    cycle = db.query(AuditCycle).filter(AuditCycle.id == item.audit_cycle_id).first()
    if not cycle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent audit cycle not found.")
    
    if cycle.status == "Closed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lock Check: Cannot verify items in a closed audit cycle."
        )

    allowed_statuses = {"Verified", "Missing", "Damaged"}
    if verify_in.verification_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid verification status. Allowed: {allowed_statuses}"
        )

    item.verification_status = verify_in.verification_status
    item.verification_notes = verify_in.verification_notes
    item.verified_at = datetime.utcnow()

    db.commit()
    db.refresh(item)

    # Activity Log
    log_activity(db, current_user.id, f"Verify Asset to {item.verification_status}", "AuditItem", item.id)

    # Notify auditor if there is a discrepancy
    if item.verification_status in ["Missing", "Damaged"]:
        create_notification(
            db,
            cycle.auditor_id,
            "Audit Discrepancy",
            "Audit Discrepancy Flagged",
            f"Asset ID {item.asset_id} has been flagged as '{item.verification_status}' during cycle '{cycle.name}'."
        )

    return item

@router.get("/audit-cycles/{id}/discrepancies", response_model=DiscrepancyReportResponse)
def get_discrepancy_report(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    cycle = db.query(AuditCycle).filter(AuditCycle.id == id).first()
    if not cycle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit cycle not found.")

    discrepancies = db.query(AuditItem).filter(
        AuditItem.audit_cycle_id == id,
        AuditItem.verification_status.in_(["Missing", "Damaged"])
    ).all()

    missing_count = sum(1 for item in discrepancies if item.verification_status == "Missing")
    damaged_count = sum(1 for item in discrepancies if item.verification_status == "Damaged")

    return {
        "audit_cycle_id": id,
        "missing_count": missing_count,
        "damaged_count": damaged_count,
        "discrepancies": discrepancies
    }

@router.post("/audit-cycles/{id}/close", response_model=AuditCycleResponse)
def close_audit_cycle(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    cycle = db.query(AuditCycle).filter(AuditCycle.id == id).first()
    if not cycle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit cycle not found.")

    if cycle.status == "Closed":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Audit cycle is already closed.")

    # Rule: Update Asset Statuses based on verification items
    audit_items = db.query(AuditItem).filter(AuditItem.audit_cycle_id == id).all()
    for item in audit_items:
        asset = db.query(Asset).filter(Asset.id == item.asset_id).first()
        if asset:
            if item.verification_status == "Missing":
                asset.status = "Lost"
            elif item.verification_status == "Damaged":
                asset.status = "Under Maintenance"
                asset.condition = "Poor"

    cycle.status = "Closed"
    db.commit()
    db.refresh(cycle)

    # Activity Log
    log_activity(db, current_user.id, "Close Audit Cycle", "AuditCycle", cycle.id)

    return cycle

