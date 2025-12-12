from typing import Optional

from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session

from requests import ArticleSaveRequest
from database import get_db
from services import ArticleService
from utils import success_response

router = APIRouter()


@router.get("/api/article/current")
async def get_current_article(
        request: Request,
        db: Session = Depends(get_db)
):
    """获取当前文章（按 id 倒序，第一条 content 不为空的记录）
    如果不存在任何非空 article，则返回 None
    """
    session = request.state.session
    article_service = ArticleService(db)

    # 获取当前文章（只返回 content 不为空的文章）
    article = article_service.get_current_article(
        session_id=session.get("session_id"),
        author=session.get("user_name", "用户"),
        author_id=session.get("user_id", "")
    )

    if article is None:
        return success_response(data=None, message="暂无文章内容")

    return success_response(data=article, message="获取当前文章成功")


@router.post("/api/article/current")
async def save_article(
        article_data: ArticleSaveRequest,
        request: Request,
        db: Session = Depends(get_db)
):
    """保存文章（保存版本，创建新记录）
    如果 content 为空，则不保存
    """
    session = request.state.session
    article_service = ArticleService(db)

    article = article_service.save_article(
        content=article_data.content,
        author=session.get("user_name", "用户"),
        author_id=session.get("user_id", ""),
        session_id=session.get("session_id", "")
    )

    # 如果 content 为空，返回提示信息
    if article is None:
        return success_response(data=None, message="文章内容为空，未保存")

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
