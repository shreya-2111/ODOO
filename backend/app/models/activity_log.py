# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(255), nullable=False)
    entity = Column(String(100), nullable=False)  # e.g., "Asset", "AuditCycle", "AssetAllocation", etc.
    entity_id = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Database relations linking logs to active users
    user = relationship("User")
