from sqlalchemy import Column, String, Text, Integer, DateTime
from sqlalchemy.sql import func
from database import Base


class RequestLog(Base):
    """请求日志模型"""
    __tablename__ = "request_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    method = Column(String, nullable=False)
    path = Column(String, nullable=False)
    session_id = Column(String, nullable=False)
    user_agent = Column(Text, nullable=True)
    ip = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "method": self.method,
            "path": self.path,
            "session_id": self.session_id,
            "user_agent": self.user_agent,
            "ip": self.ip,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }
