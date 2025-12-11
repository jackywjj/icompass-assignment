from pydantic import BaseModel
from typing import Optional


class RequestLog(BaseModel):
    """请求日志模型"""
    id: int
    method: str
    path: str
    timestamp: str
    session_id: str
    user_agent: Optional[str] = None
    ip: Optional[str] = None
