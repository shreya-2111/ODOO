# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import List
from ..schemas.resource_booking import BookingCreate, BookingUpdate, BookingResponse
from ..models.resource_booking import ResourceBooking
from ..models.asset import Asset
from ..models.user import User
from ..dependencies import get_db, get_current_active_user
from ..services.notification_service import create_notification
from ..services.activity_log_service import log_activity

router = APIRouter(prefix="/bookings", tags=["Resource Booking"])

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify start time is before end time
    if booking_in.start_time >= booking_in.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time."
        )

    # Verify asset exists
    asset = db.query(Asset).filter(Asset.id == booking_in.resource_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource asset not found.")

    # Rule: Check if asset is marked as shared resource
    if not asset.is_shared_resource:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected asset is not configured as a shared bookable resource."
        )

    # Verify employee exists
    employee = db.query(User).filter(User.id == booking_in.employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee profile not found.")

    # Rule: Overlap validation conflict check
    # Mathematical interval overlap formula: Booking_start < Input_end AND Booking_end > Input_start
    overlap_booking = db.query(ResourceBooking).filter(
        ResourceBooking.resource_id == booking_in.resource_id,
        ResourceBooking.status != "Cancelled",
        ResourceBooking.start_time < booking_in.end_time,
        ResourceBooking.end_time > booking_in.start_time
    ).first()

    if overlap_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Conflict: The selected resource is already booked during this time slot."
        )

    new_booking = ResourceBooking(
        resource_id=booking_in.resource_id,
        employee_id=booking_in.employee_id,
        start_time=booking_in.start_time,
        end_time=booking_in.end_time,
        status="Upcoming"
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # Activity Log
    log_activity(db, current_user.id, "Create Booking", "ResourceBooking", new_booking.id)

    # Notification for confirmation
    create_notification(
        db,
        booking_in.employee_id,
        "Booking Confirmed",
        "Booking Confirmed",
        f"Your booking for resource '{asset.name}' from {booking_in.start_time} to {booking_in.end_time} has been confirmed."
    )

    return new_booking

@router.get("", response_model=List[BookingResponse])
def list_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(ResourceBooking).all()

@router.get("/{id}", response_model=BookingResponse)
def get_booking(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    booking = db.query(ResourceBooking).filter(ResourceBooking.id == id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking record not found.")
    return booking

@router.put("/{id}", response_model=BookingResponse)
def update_booking_status(
    id: int,
    booking_in: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    booking = db.query(ResourceBooking).filter(ResourceBooking.id == id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking record not found.")

    if booking_in.status is not None:
        allowed_statuses = {"Upcoming", "Ongoing", "Completed", "Cancelled"}
        if booking_in.status not in allowed_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status code value. Allowed: {allowed_statuses}"
            )
        booking.status = booking_in.status

    db.commit()
    db.refresh(booking)

    # Activity Log
    log_activity(db, current_user.id, f"Update Booking Status to {booking.status}", "ResourceBooking", booking.id)

    return booking

