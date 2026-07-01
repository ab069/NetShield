from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.traffic import TrafficFlow
from app.schemas.traffic import TrafficStats


def create_traffic_flow(db: Session, user_id: int, **kwargs) -> TrafficFlow:
    flow = TrafficFlow(user_id=user_id, **kwargs)
    db.add(flow)
    db.commit()
    db.refresh(flow)
    return flow


def list_traffic_flows(db: Session, skip: int = 0, limit: int = 100) -> list[TrafficFlow]:
    return db.query(TrafficFlow).order_by(TrafficFlow.created_at.desc()).offset(skip).limit(limit).all()


def get_traffic_stats(db: Session) -> TrafficStats:
    total = db.query(TrafficFlow).count()
    total_sent = db.query(func.coalesce(func.sum(TrafficFlow.bytes_sent), 0)).scalar()
    total_recv = db.query(func.coalesce(func.sum(TrafficFlow.bytes_received), 0)).scalar()
    suspicious = db.query(TrafficFlow).filter(TrafficFlow.is_suspicious == True).count()
    avg_score = db.query(func.coalesce(func.avg(TrafficFlow.threat_score), 0.0)).scalar()
    return TrafficStats(
        total_flows=total,
        total_bytes_sent=total_sent,
        total_bytes_received=total_recv,
        suspicious_count=suspicious,
        average_threat_score=float(avg_score),
    )
