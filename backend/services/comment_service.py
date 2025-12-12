from datetime import datetime
from typing import List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import desc
from models import Comment


class CommentService:
    """批注服务类"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def save_comment(
        self,
        text: str,
        target_text: str,
        start_index: int,
        end_index: int,
        author: str,
        author_id: str,
        session_id: str
    ) -> Dict:
        """保存批注"""
        comment = Comment(
            text=text,
            target_text=target_text,
            start_index=start_index,
            end_index=end_index,
            author=author,
            author_id=author_id,
            session_id=session_id,
            timestamp=int(datetime.now().timestamp() * 1000)
        )
        
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        
        return comment.to_dict()
    
    def get_comments(self) -> List[Dict]:
        """获取所有批注，按时间倒序"""
        comments = self.db.query(Comment).order_by(desc(Comment.timestamp)).all()
        return [comment.to_dict() for comment in comments]
    
    def get_comment_count(self) -> int:
        """获取批注总数"""
        return self.db.query(Comment).count()
