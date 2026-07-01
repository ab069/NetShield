from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.alert import AlertCreate, AlertResponse
from app.services import alert_service

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.post("/", response_model=AlertResponse)
def create_alert(data: AlertCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return alert_service.create_alert(db, current_user.id, data)


@router.get("/", response_model=list[AlertResponse])
def list_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return alert_service.list_alerts(db, skip=skip, limit=limit)


@router.get("/stats")
def alert_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return alert_service.get_alert_stats(db)


@router.patch("/{alert_id}/status", response_model=AlertResponse)
def update_status(alert_id: int, status: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    alert = alert_service.update_alert_status(db, alert_id, status)
    if not alert:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")
    return alert
