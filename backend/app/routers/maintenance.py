# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import List
from ..schemas.maintenance import TicketCreate, TicketAssign, TicketResponse
from ..models.maintenance_ticket import MaintenanceTicket
from ..models.asset import Asset
from ..models.user import User
from ..dependencies import get_db, get_current_active_user
from ..services.notification_service import create_notification
from ..services.activity_log_service import log_activity

router = APIRouter(prefix="/maintenance", tags=["Maintenance Management"])

@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def raise_request(
    ticket_in: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify asset exists
    asset = db.query(Asset).filter(Asset.id == ticket_in.asset_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found.")

    allowed_priorities = {"Low", "Medium", "High", "Critical"}
    if ticket_in.priority not in allowed_priorities:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid priority. Allowed: {allowed_priorities}"
        )

    new_ticket = MaintenanceTicket(
        asset_id=ticket_in.asset_id,
        description=ticket_in.description,
        priority=ticket_in.priority,
        image_url=ticket_in.image_url,
        status="Pending"
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    # Activity Log
    log_activity(db, current_user.id, "Raise Maintenance Request", "MaintenanceTicket", new_ticket.id)

    return new_ticket

@router.get("", response_model=List[TicketResponse])
def list_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(MaintenanceTicket).all()

@router.post("/{id}/approve", response_model=TicketResponse)
def approve_request(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    ticket = db.query(MaintenanceTicket).filter(MaintenanceTicket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found.")

    ticket.status = "Approved"

    # Rule Hook: Approved -> Under Maintenance
    asset = db.query(Asset).filter(Asset.id == ticket.asset_id).first()
    if asset:
        asset.status = "Under Maintenance"

    db.commit()
    db.refresh(ticket)

    # Activity Log
    log_activity(db, current_user.id, "Approve Maintenance Request", "MaintenanceTicket", ticket.id)

    # Notify technician if assigned
    if ticket.technician_id and asset:
        create_notification(
            db,
            ticket.technician_id,
            "Maintenance Approved",
            "Maintenance Request Approved",
            f"Maintenance request for asset '{asset.name}' has been approved."
        )

    return ticket

@router.post("/{id}/reject", response_model=TicketResponse)
def reject_request(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    ticket = db.query(MaintenanceTicket).filter(MaintenanceTicket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found.")

    ticket.status = "Rejected"
    db.commit()
    db.refresh(ticket)

    # Activity Log
    log_activity(db, current_user.id, "Reject Maintenance Request", "MaintenanceTicket", ticket.id)

    return ticket

@router.post("/{id}/assign", response_model=TicketResponse)
def assign_technician(
    id: int,
    assign_in: TicketAssign,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    ticket = db.query(MaintenanceTicket).filter(MaintenanceTicket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found.")

    # Verify technician profile exists
    tech = db.query(User).filter(User.id == assign_in.technician_id).first()
    if not tech:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assigned technician profile not found.")

    ticket.technician_id = assign_in.technician_id
    ticket.status = "Technician Assigned"
    db.commit()
    db.refresh(ticket)

    # Activity Log
    log_activity(db, current_user.id, "Assign Technician", "MaintenanceTicket", ticket.id)

    # Notify assigned technician
    asset = db.query(Asset).filter(Asset.id == ticket.asset_id).first()
    if asset:
        create_notification(
            db,
            assign_in.technician_id,
            "Maintenance Approved",
            "Maintenance Request Assigned",
            f"You have been assigned to repair asset '{asset.name}'."
        )

    return ticket

@router.post("/{id}/start", response_model=TicketResponse)
def start_maintenance(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    ticket = db.query(MaintenanceTicket).filter(MaintenanceTicket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found.")

    ticket.status = "In Progress"
    db.commit()
    db.refresh(ticket)

    # Activity Log
    log_activity(db, current_user.id, "Start Maintenance", "MaintenanceTicket", ticket.id)

    return ticket

@router.post("/{id}/resolve", response_model=TicketResponse)
def resolve_request(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    ticket = db.query(MaintenanceTicket).filter(MaintenanceTicket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found.")

    ticket.status = "Resolved"

    # Rule Hook: Resolved -> Available
    asset = db.query(Asset).filter(Asset.id == ticket.asset_id).first()
    if asset:
        asset.status = "Available"

    db.commit()
    db.refresh(ticket)

    # Activity Log
    log_activity(db, current_user.id, "Resolve Maintenance", "MaintenanceTicket", ticket.id)

    return ticket

