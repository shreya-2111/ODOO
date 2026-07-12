# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from ..database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    parent_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    head_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_active = Column(Boolean, default=True)

    # Self-referencing relationship for parenting hierarchies
    parent = relationship("Department", remote_side=[id])
    
    # Links to the User model as the department head
    head = relationship("User", foreign_keys=[head_id])
