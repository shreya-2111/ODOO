from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..schemas.asset_category import AssetCategoryCreate, AssetCategoryUpdate, AssetCategoryResponse
from ..models.asset_category import AssetCategory
from ..dependencies import get_db, get_current_active_user
from ..models.user import User

router = APIRouter(prefix="/categories", tags=["Asset Categories"])

@router.post("", response_model=AssetCategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    cat_in: AssetCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify unique name & code
    existing_name = db.query(AssetCategory).filter(AssetCategory.name == cat_in.name).first()
    if existing_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category name already exists.")

    existing_code = db.query(AssetCategory).filter(AssetCategory.code == cat_in.code).first()
    if existing_code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category prefix code already exists.")

    new_cat = AssetCategory(
        name=cat_in.name,
        code=cat_in.code.upper(),
        metadata_fields=cat_in.metadata_fields
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@router.get("", response_model=List[AssetCategoryResponse])
def list_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(AssetCategory).all()

@router.get("/{id}", response_model=AssetCategoryResponse)
def get_category(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    cat = db.query(AssetCategory).filter(AssetCategory.id == id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset category not found.")
    return cat

@router.put("/{id}", response_model=AssetCategoryResponse)
def update_category(
    id: int,
    cat_in: AssetCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    cat = db.query(AssetCategory).filter(AssetCategory.id == id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset category not found.")

    if cat_in.name is not None:
        # Check unique name
        if cat_in.name != cat.name:
            existing = db.query(AssetCategory).filter(AssetCategory.name == cat_in.name).first()
            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category name already in use.")
        cat.name = cat_in.name

    if cat_in.code is not None:
        # Check unique code
        if cat_in.code.upper() != cat.code:
            existing = db.query(AssetCategory).filter(AssetCategory.code == cat_in.code.upper()).first()
            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category prefix code already in use.")
        cat.code = cat_in.code.upper()

    if cat_in.metadata_fields is not None:
        cat.metadata_fields = cat_in.metadata_fields

    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    cat = db.query(AssetCategory).filter(AssetCategory.id == id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset category not found.")
    db.delete(cat)
    db.commit()
    return None
