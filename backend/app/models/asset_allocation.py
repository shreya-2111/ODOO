from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class AssetAllocation(Base):
    __tablename__ = "asset_allocations"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    allocated_at = Column(DateTime, default=datetime.utcnow)
    expected_return_date = Column(Date, nullable=False)
    returned_at = Column(DateTime, nullable=True)
    return_condition_notes = Column(Text, nullable=True)
    status = Column(String(50), default="Active")  # Active, Returned

    # Relationship bindings
    asset = relationship("Asset")
    employee = relationship("User", foreign_keys=[employee_id])
    department = relationship("Department", foreign_keys=[department_id])
