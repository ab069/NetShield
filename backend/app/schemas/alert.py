from datetime import datetime

from pydantic import BaseModel


class AlertCreate(BaseModel):
    title: str
    description: str | None = None
    alert_type: str
    source_ip: str
    dest_ip: str
    protocol: str
    severity: str = "medium"
    details: dict | None = None


class AlertResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str | None
    alert_type: str
    source_ip: str
    dest_ip: str
    protocol: str
    severity: str
    status: str
    details: dict | None
    created_at: datetime

    model_config = {"from_attributes": True}
