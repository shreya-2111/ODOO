from sqlalchemy import Column, Integer, String, Text
from ..database import Base

class AssetCategory(Base):
    __tablename__ = "asset_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    code = Column(String(20), unique=True, nullable=False, index=True)  # Prefix, e.g., "ELE", "FUR"
    metadata_fields = Column(Text, nullable=True)  # Stored as JSON string schema definition
