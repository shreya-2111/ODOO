from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas.asset import AssetCreate, AssetUpdate, AssetResponse
from ..models.asset import Asset
from ..models.asset_category import AssetCategory
from ..services.asset_tag_service import generate_asset_tag
from ..dependencies import get_db, get_current_active_user
from ..models.user import User

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.post("", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
def create_asset(
    asset_in: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify unique serial number
    existing_sn = db.query(Asset).filter(Asset.serial_number == asset_in.serial_number).first()
    if existing_sn:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Asset serial number already exists.")

    # Check category existence
    category = db.query(AssetCategory).filter(AssetCategory.id == asset_in.category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Selected category not found.")

    # Validate asset status if provided
    allowed_statuses = {"Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"}
    if asset_in.status not in allowed_statuses:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid status value. Allowed: {allowed_statuses}")

    # Generate custom asset tag code automatically
    asset_tag = generate_asset_tag(db, asset_in.category_id)

    new_asset = Asset(
        tag=asset_tag,
        name=asset_in.name,
        serial_number=asset_in.serial_number,
        category_id=asset_in.category_id,
        acquisition_date=asset_in.acquisition_date,
        cost=asset_in.cost,
        condition=asset_in.condition,
        status=asset_in.status,
        location=asset_in.location,
        photo_url=asset_in.photo_url,
        is_shared_resource=asset_in.is_shared_resource,
        custom_attributes=asset_in.custom_attributes
    )
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    return new_asset

@router.get("", response_model=List[AssetResponse])
def list_assets(
    category_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    is_shared_resource: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Asset)
    
    if category_id is not None:
        query = query.filter(Asset.category_id == category_id)
        
    if status is not None:
        query = query.filter(Asset.status == status)
        
    if location is not None:
        query = query.filter(Asset.location.like(f"%{location}%"))
        
    if is_shared_resource is not None:
        query = query.filter(Asset.is_shared_resource == is_shared_resource)
        
    return query.all()

@router.get("/{id}", response_model=AssetResponse)
def get_asset(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    asset = db.query(Asset).filter(Asset.id == id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset record not found.")
    return asset

@router.put("/{id}", response_model=AssetResponse)
def update_asset(
    id: int,
    asset_in: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    asset = db.query(Asset).filter(Asset.id == id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset record not found.")

    if asset_in.category_id is not None and asset_in.category_id != asset.category_id:
        category = db.query(AssetCategory).filter(AssetCategory.id == asset_in.category_id).first()
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Selected category not found.")
        asset.category_id = asset_in.category_id
        # Re-generate tag since category has changed
        asset.tag = generate_asset_tag(db, asset_in.category_id)

    if asset_in.serial_number is not None:
        # Check uniqueness if serial number changes
        if asset_in.serial_number != asset.serial_number:
            existing = db.query(Asset).filter(Asset.serial_number == asset_in.serial_number).first()
            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Serial number already exists on another asset record.")
        asset.serial_number = asset_in.serial_number

    if asset_in.status is not None:
        allowed_statuses = {"Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"}
        if asset_in.status not in allowed_statuses:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid status value. Allowed: {allowed_statuses}")
        asset.status = asset_in.status

    if asset_in.name is not None:
        asset.name = asset_in.name
    if asset_in.acquisition_date is not None:
        asset.acquisition_date = asset_in.acquisition_date
    if asset_in.cost is not None:
        asset.cost = asset_in.cost
    if asset_in.condition is not None:
        asset.condition = asset_in.condition
    if asset_in.location is not None:
        asset.location = asset_in.location
    if asset_in.photo_url is not None:
        asset.photo_url = asset_in.photo_url
    if asset_in.is_shared_resource is not None:
        asset.is_shared_resource = asset_in.is_shared_resource
    if asset_in.custom_attributes is not None:
        asset.custom_attributes = asset_in.custom_attributes

    db.commit()
    db.refresh(asset)
    return asset

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    asset = db.query(Asset).filter(Asset.id == id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset record not found.")
    db.delete(asset)
    db.commit()
    return None
