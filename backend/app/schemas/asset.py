from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional

class AssetBase(BaseModel):
    name: str
    serial_number: str
    category_id: int
    acquisition_date: date
    cost: Optional[float] = 0.0
    condition: Optional[str] = "Good"  # Excellent, Good, Fair, Poor
    status: Optional[str] = "Available"  # Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed
    location: str
    photo_url: Optional[str] = None
    is_shared_resource: Optional[bool] = False
    custom_attributes: Optional[str] = None  # JSON string mapping category spec values

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    serial_number: Optional[str] = None
    category_id: Optional[int] = None
    acquisition_date: Optional[date] = None
    cost: Optional[float] = None
    condition: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None
    is_shared_resource: Optional[bool] = None
    custom_attributes: Optional[str] = None

class AssetCategoryBrief(BaseModel):
    id: int
    name: str
    code: str

    model_config = ConfigDict(from_attributes=True)

class AssetResponse(AssetBase):
    id: int
    tag: str
    created_at: datetime
    updated_at: datetime
    category: AssetCategoryBrief

    model_config = ConfigDict(from_attributes=True)
