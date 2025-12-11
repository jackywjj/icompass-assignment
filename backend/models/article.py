from sqlalchemy import Column, String, Text, Integer, DateTime
from sqlalchemy.sql import func
from database import Base


class Article(Base):
    """文章模型（每次保存版本都创建新记录）"""
    __tablename__ = "articles"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(Text, nullable=False)
    author = Column(String, nullable=False)
    author_id = Column(String, nullable=False)
    session_id = Column(String, nullable=False)
    timestamp = Column(Integer, nullable=False)  # 毫秒时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "content": self.content,
            "author": self.author,
            "author_id": self.author_id,
            "session_id": self.session_id,
            "timestamp": self.timestamp,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
