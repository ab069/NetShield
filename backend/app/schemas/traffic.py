from datetime import datetime

from pydantic import BaseModel


class TrafficResponse(BaseModel):
    id: int
    user_id: int
    src_ip: str
    dst_ip: str
    protocol: str
    port: int
    bytes_sent: int
    bytes_received: int
    duration: float
    is_suspicious: bool
    threat_score: int
    created_at: datetime

    model_config = {"from_attributes": True}


class TrafficStats(BaseModel):
    total_flows: int
    total_bytes_sent: int
    total_bytes_received: int
    suspicious_count: int
    average_threat_score: float
