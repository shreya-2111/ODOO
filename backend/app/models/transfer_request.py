from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class TransferRequest(Base):
    __tablename__ = "transfer_requests"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    source_employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    requested_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="Requested")  # Requested, Approved, Reallocated, Rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Multi-user and multi-department relationship resolution
    asset = relationship("Asset")
    source_employee = relationship("User", foreign_keys=[source_employee_id])
    target_employee = relationship("User", foreign_keys=[target_employee_id])
    target_department = relationship("Department", foreign_keys=[target_department_id])
    requested_by = relationship("User", foreign_keys=[requested_by_id])
