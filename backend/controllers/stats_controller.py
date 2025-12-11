from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from services import ArticleService, SessionService, RequestService, VersionService, CommentService
from database import get_db
from utils import success_response

router = APIRouter()


@router.get("/api/stats")
async def get_stats(
    request: Request,
    db: Session = Depends(get_db)
):
    """获取统计信息"""
    article_service = ArticleService(db)
    session_service = SessionService(db)
    request_service = RequestService(db)
    version_service = VersionService(db)
    comment_service = CommentService(db)
    
    stats = {
        "total_sessions": session_service.get_session_count(),
        "active_sessions": session_service.get_active_session_count(),
        "total_requests": request_service.get_request_count(),
        "total_versions": version_service.get_version_count(),
        "total_comments": comment_service.get_comment_count()
    }
    
    return success_response(data=stats, message="获取统计信息成功")
