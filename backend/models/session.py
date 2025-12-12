from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func

from .base import BaseModel


class Session(BaseModel):
    """Session 模型"""
    __tablename__ = "sessions"

    session_id = Column(String, nullable=False, unique=True)  # 外部传入的 session_id
    user_id = Column(String, nullable=False)
    user_name = Column(String, nullable=False)
    ip = Column(String, nullable=True)
    user_agent = Column(Text, nullable=True)
    last_active = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
