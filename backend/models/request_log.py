from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func

from .base import BaseModel


class RequestLog(BaseModel):
    """请求日志模型"""
    __tablename__ = "request_logs"

    method = Column(String, nullable=False)
    path = Column(String, nullable=False)
    session_id = Column(String, nullable=False)
    user_agent = Column(Text, nullable=True)
    ip = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # RequestLog 使用 timestamp 而不是 created_at，所以重写 to_dict 排除 created_at
    def to_dict(self, exclude: list = None) -> dict:
        """转换为字典，排除 created_at 字段"""
        if exclude is None:
            exclude = []
        exclude.append('created_at')  # RequestLog 不使用 created_at
        return super().to_dict(exclude)
