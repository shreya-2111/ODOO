from pydantic import BaseModel, ConfigDict
from typing import Optional

class AssetCategoryBase(BaseModel):
    name: str
    code: str
    metadata_fields: Optional[str] = None  # JSON serialization mapping specifications

class AssetCategoryCreate(AssetCategoryBase):
    pass

class AssetCategoryUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    metadata_fields: Optional[str] = None

class AssetCategoryResponse(AssetCategoryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
