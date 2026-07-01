from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.schemas.alert import AlertCreate


def create_alert(db: Session, user_id: int, data: AlertCreate) -> Alert:
    alert = Alert(
        user_id=user_id,
        title=data.title,
        description=data.description,
        alert_type=data.alert_type,
        source_ip=data.source_ip,
        dest_ip=data.dest_ip,
        protocol=data.protocol,
        severity=data.severity,
        status="open",
        details=data.details,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def list_alerts(db: Session, skip: int = 0, limit: int = 100) -> list[Alert]:
    return db.query(Alert).order_by(Alert.created_at.desc()).offset(skip).limit(limit).all()


def update_alert_status(db: Session, alert_id: int, status: str) -> Alert | None:
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.status = status
        db.commit()
        db.refresh(alert)
    return alert


def get_alert_stats(db: Session) -> dict:
    total = db.query(Alert).count()
    critical = db.query(Alert).filter(Alert.severity == "critical").count()
    open_count = db.query(Alert).filter(Alert.status == "open").count()
    resolved = db.query(Alert).filter(Alert.status == "resolved").count()
    return {
        "total": total,
        "critical": critical,
        "open": open_count,
        "resolved": resolved,
    }
