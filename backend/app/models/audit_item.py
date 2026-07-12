from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..database import Base

class AuditItem(Base):
    __tablename__ = "audit_items"

    id = Column(Integer, primary_key=True, index=True)
    audit_cycle_id = Column(Integer, ForeignKey("audit_cycles.id"), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    verification_status = Column(String(50), default="Pending")  # Pending, Verified, Missing, Damaged
    verification_notes = Column(Text, nullable=True)
    verified_at = Column(DateTime, nullable=True)

    # Establish backward and forward model relationships
    audit_cycle = relationship("AuditCycle", back_populates="audit_items")
    asset = relationship("Asset")
