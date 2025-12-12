from pydantic import BaseModel


class ArticleSaveRequest(BaseModel):
    """保存文章的请求模型"""
    content: str
