from datetime import datetime
from typing import Dict, Optional

from sqlalchemy import desc
from sqlalchemy.orm import Session

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
            session_id: 如果文章不存在，使用此 session_id 创建一条空记录（已废弃，不再创建空记录）
            author: 如果文章不存在，使用此 author 创建一条空记录（已废弃，不再创建空记录）
            author_id: 如果文章不存在，使用此 author_id 创建一条空记录（已废弃，不再创建空记录）
        """
        # 按 id 倒序排列，查找第一条 content 不为空的记录
        articles = self.db.query(Article).order_by(desc(Article.id)).all()
        
        for article in articles:
            # 如果 content 不为空（去除空白字符后），返回该文章
            if article.content and article.content.strip():
                return article.to_dict()
        
        # 如果没有找到任何非空文章，返回 None
        return None

    def save_article(
            self,
            content: str,
            author: str,
            author_id: str,
            session_id: str
    ) -> Optional[Dict]:
        """保存文章（创建新记录，不更新）
        
        Args:
            content: 文章内容，如果为空（去除空白字符后）则不保存
            author: 作者
            author_id: 作者ID
            session_id: 会话ID
            
        Returns:
            保存成功返回文章字典，如果 content 为空则返回 None
        """
        # 如果 content 为空（去除空白字符后），则不保存
        if not content or not content.strip():
            return None
        
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
