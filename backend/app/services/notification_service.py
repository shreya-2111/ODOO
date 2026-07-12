from sqlalchemy.orm import Session
from ..models.notification import Notification

def create_notification(db: Session, user_id: int, notification_type: str, title: str, message: str) -> Notification:
    notification = Notification(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        is_read=False
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
