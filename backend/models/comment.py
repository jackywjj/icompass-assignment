from sqlalchemy import Column, String, Text, Integer

from .base import BaseModel


class Comment(BaseModel):
    """批注模型"""
    __tablename__ = "comments"

    text = Column(Text, nullable=False)
    target_text = Column(Text, nullable=False)  # 被批注的文本
    start_index = Column(Integer, nullable=False)
    end_index = Column(Integer, nullable=False)
    author = Column(String, nullable=False)
    author_id = Column(String, nullable=False)
    session_id = Column(String, nullable=False)
    timestamp = Column(Integer, nullable=False)  # 毫秒时间戳
