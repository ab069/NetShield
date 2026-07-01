from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.traffic import TrafficResponse, TrafficStats
from app.services import traffic_service

router = APIRouter(prefix="/api/traffic", tags=["traffic"])


@router.get("/", response_model=list[TrafficResponse])
def list_traffic(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return traffic_service.list_traffic_flows(db, skip=skip, limit=limit)


@router.get("/stats", response_model=TrafficStats)
def traffic_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return traffic_service.get_traffic_stats(db)
