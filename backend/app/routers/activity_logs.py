# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import List
from ..schemas.activity_log import ActivityLogResponse
from ..models.activity_log import ActivityLog
from ..models.user import User
from ..dependencies import get_db, get_current_active_user

router = APIRouter(prefix="/activity-logs", tags=["Activity Logs"])

@router.get("", response_model=List[ActivityLogResponse])
def list_activity_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).all()
