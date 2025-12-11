from typing import Optional

from pydantic import BaseModel


class CommentSaveRequest(BaseModel):
    """保存批注的请求模型"""
    text: str
    target_text: str
    start_index: int
    end_index: int


class CommentResponse(BaseModel):
    """批注响应模型"""
    id: int
    text: str
    target_text: str
    start_index: int
    end_index: int
    author: str
    author_id: str
    session_id: str
    timestamp: int
    created_at: Optional[str] = None
