from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from services import SessionService
from database import get_db
from utils import success_response

router = APIRouter()


@router.get("/api/sessions")
async def get_sessions(
    request: Request,
    db: Session = Depends(get_db)
):
    """获取所有活跃的 session（用于协同操作）"""
    session_service = SessionService(db)
    active_sessions = session_service.get_active_sessions()
    
    return success_response(
        data={"sessions": active_sessions, "count": len(active_sessions)},
        message="获取活跃 session 列表成功"
    )
