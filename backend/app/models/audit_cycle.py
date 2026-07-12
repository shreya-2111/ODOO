from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class AuditCycle(Base):
    __tablename__ = "audit_cycles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    auditor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="Draft")  # Draft, Active, Closed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship mapping for auditor links and cascaded items lists
    auditor = relationship("User")
    audit_items = relationship("AuditItem", back_populates="audit_cycle", cascade="all, delete-orphan")
