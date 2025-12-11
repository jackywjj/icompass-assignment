from fastapi import APIRouter, Request, Depends
from typing import Optional
from sqlalchemy.orm import Session
from beans import ArticleSaveRequest
from services import ArticleService
from database import get_db
from utils import success_response, error_response, not_found_response

router = APIRouter()


@router.get("/api/article/current")
async def get_current_article(
    request: Request,
    db: Session = Depends(get_db)
):
    """获取当前文章（按 id 倒序，第一条为最近的一条记录）
    如果不存在任何 article，则使用第一个请求用户的 session 创建一条记录
    """
    session = request.state.session
    article_service = ArticleService(db)
    
    # 传递 session 信息，如果文章不存在则使用此信息创建
    article = article_service.get_current_article(
        session_id=session.get("session_id"),
        author=session.get("user_name", "用户"),
        author_id=session.get("user_id", "")
    )
    
    return success_response(data=article, message="获取当前文章成功")


@router.post("/api/article/current")
async def save_article(
    article_data: ArticleSaveRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """保存文章（保存版本，创建新记录）"""
    session = request.state.session
    article_service = ArticleService(db)
    
    # 保存版本即保存 article，创建新记录
    article = article_service.save_article(
        content=article_data.content,
        author=session.get("user_name", "用户"),
        author_id=session.get("user_id", ""),
        session_id=session.get("session_id", "")
    )
    
    return success_response(data=article, message="文章保存成功")


@router.get("/api/articles")
async def get_all_articles(
    request: Request,
    limit: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """获取所有文章（版本历史），按 id 倒序排列"""
    article_service = ArticleService(db)
    articles = article_service.get_all_articles(limit=limit)
    
    return success_response(
        data={"articles": articles, "count": len(articles)},
        message="获取版本历史成功"
    )
