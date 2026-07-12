from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..models.asset_category import AssetCategory
from ..models.asset import Asset

def generate_asset_tag(db: Session, category_id: int) -> str:
    category = db.query(AssetCategory).filter(AssetCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset category not found")

    # Format category prefix code
    prefix_code = category.code.strip().upper()
    prefix = f"AST-{prefix_code}-"

    # Count existing assets in this category
    count = db.query(Asset).filter(Asset.category_id == category_id).count()
    
    sequence = count + 1
    tag = f"{prefix}{str(sequence).zfill(4)}"

    # Ensure uniqueness in case of sequence holes
    while db.query(Asset).filter(Asset.tag == tag).first() is not None:
        sequence += 1
        tag = f"{prefix}{str(sequence).zfill(4)}"

    return tag
