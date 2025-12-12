from sqlalchemy import Column, String, Text, Integer

from .base import BaseModel


class Article(BaseModel):
    """文章模型（每次保存版本都创建新记录）"""
    __tablename__ = "articles"

    content = Column(Text, nullable=False)
    author = Column(String, nullable=False)
    author_id = Column(String, nullable=False)
    session_id = Column(String, nullable=False)
    timestamp = Column(Integer, nullable=False)  # 毫秒时间戳
