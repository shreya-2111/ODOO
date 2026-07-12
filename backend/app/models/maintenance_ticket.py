# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class MaintenanceTicket(Base):
    __tablename__ = "maintenance_tickets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(50), default="Medium")  # Low, Medium, High, Critical
    image_url = Column(String(255), nullable=True)
    technician_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(50), default="Pending")  # Pending, Approved, Rejected, Technician Assigned, In Progress, Resolved
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Database relations mapping assets and technicians
    asset = relationship("Asset")
    technician = relationship("User", foreign_keys=[technician_id])
