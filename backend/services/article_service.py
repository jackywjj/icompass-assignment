from datetime import datetime
from typing import Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from models import Article


class ArticleService:
    """文章服务类（每次保存版本都创建新记录）"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_current_article(
        self,
        session_id: Optional[str] = None,
        author: Optional[str] = None,
        author_id: Optional[str] = None
    ) -> Optional[Dict]:
        """获取当前文章（按 id 倒序，第一条为最近的一条记录）
        
        Args:
            session_id: 如果文章不存在，使用此 session_id 创建一条空记录
            author: 如果文章不存在，使用此 author 创建一条空记录
            author_id: 如果文章不存在，使用此 author_id 创建一条空记录
        """
        # 按 id 倒序排列，获取第一条（最新的记录）
        article = self.db.query(Article).order_by(desc(Article.id)).first()
        
        if not article:
            # 如果不存在任何记录，使用第一个请求用户的 session 创建一条空记录
            if session_id:
                article = Article(
                    content="",
                    author=author or "用户",
                    author_id=author_id or "",
                    session_id=session_id,
                    timestamp=int(datetime.now().timestamp() * 1000)
                )
                self.db.add(article)
                self.db.commit()
                self.db.refresh(article)
            else:
                return None
        
        return article.to_dict()
    
    def save_article(
        self,
        content: str,
        author: str,
        author_id: str,
        session_id: str
    ) -> Dict:
        """保存文章（创建新记录，不更新）"""
        article = Article(
            content=content,
            author=author,
            author_id=author_id,
            session_id=session_id,
            timestamp=int(datetime.now().timestamp() * 1000)
        )
        
        self.db.add(article)
        self.db.commit()
        self.db.refresh(article)
        
        return article.to_dict()
    
    def get_all_articles(self, limit: Optional[int] = None) -> list:
        """获取所有文章（版本历史），按 id 倒序排列"""
        query = self.db.query(Article).order_by(desc(Article.id))
        
        if limit:
            query = query.limit(limit)
        
        articles = query.all()
        return [article.to_dict() for article in articles]
