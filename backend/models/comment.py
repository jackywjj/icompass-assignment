from sqlalchemy import Column, String, Text, Integer, DateTime
from sqlalchemy.sql import func
from database import Base


class Comment(Base):
    """批注模型"""
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(Text, nullable=False)
    target_text = Column(Text, nullable=False)  # 被批注的文本
    start_index = Column(Integer, nullable=False)
    end_index = Column(Integer, nullable=False)
    author = Column(String, nullable=False)
    author_id = Column(String, nullable=False)
    session_id = Column(String, nullable=False)
    timestamp = Column(Integer, nullable=False)  # 毫秒时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "text": self.text,
            "target_text": self.target_text,
            "start_index": self.start_index,
            "end_index": self.end_index,
            "author": self.author,
            "author_id": self.author_id,
            "session_id": self.session_id,
            "timestamp": self.timestamp,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
