from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from services import RequestService
from database import get_db
from utils import success_response

router = APIRouter()


@router.get("/api/requests")
async def get_requests(
    request: Request, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """获取请求日志"""
    request_service = RequestService(db)
    requests = request_service.get_requests(limit=limit)
    
    return success_response(
        data={"requests": requests, "count": len(requests)},
        message="获取请求日志成功"
    )
