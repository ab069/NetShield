from sqlalchemy import Column, Integer, String, BigInteger, Float, Boolean, DateTime, ForeignKey, func

from app.core.database import Base


class TrafficFlow(Base):
    __tablename__ = "traffic_flows"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    src_ip = Column(String(45), nullable=False)
    dst_ip = Column(String(45), nullable=False)
    protocol = Column(String(20), nullable=False)
    port = Column(Integer, nullable=False)
    bytes_sent = Column(BigInteger, default=0)
    bytes_received = Column(BigInteger, default=0)
    duration = Column(Float, default=0.0)
    is_suspicious = Column(Boolean, default=False)
    threat_score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
