# pyrefly: ignore [missing-import]
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ActivityLogResponse(BaseModel):
    id: int
    user_id: int
    action: str
    entity: str
    entity_id: Optional[int] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
