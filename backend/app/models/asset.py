from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    serial_number = Column(String(100), unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("asset_categories.id"), nullable=False)
    acquisition_date = Column(Date, nullable=False)
    cost = Column(Float, default=0.0)
    condition = Column(String(50), default="Good")  # Excellent, Good, Fair, Poor
    status = Column(String(50), default="Available")  # Available, Allocated, Reserved, Under Maintenance, etc.
    location = Column(String(100), nullable=False)
    photo_url = Column(String(255), nullable=True)
    is_shared_resource = Column(Boolean, default=False)
    custom_attributes = Column(Text, nullable=True)  # JSON string matching category-specific metadata definitions
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Establish link to Category details
    category = relationship("AssetCategory")
