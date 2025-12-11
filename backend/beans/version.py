from pydantic import BaseModel
from typing import Optional


class VersionSaveRequest(BaseModel):
    """保存版本的请求模型"""
    content: str


class VersionResponse(BaseModel):
    """版本响应模型"""
    id: int
    content: str
    author: str
    author_id: str
    session_id: str
    timestamp: int
    created_at: Optional[str] = None
