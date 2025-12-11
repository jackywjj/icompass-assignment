from typing import Optional

from pydantic import BaseModel


class ArticleSaveRequest(BaseModel):
    """保存文章的请求模型"""
    content: str


class ArticleResponse(BaseModel):
    """文章响应模型"""
    id: int
    content: str
    updated_at: Optional[str] = None
