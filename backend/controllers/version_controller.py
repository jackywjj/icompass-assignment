from fastapi import APIRouter, Request, Depends
from typing import Optional
from sqlalchemy.orm import Session
from beans import VersionSaveRequest
from services import VersionService
from database import get_db
from utils import success_response, error_response, not_found_response

router = APIRouter()


@router.post("/api/versions")
async def save_version(
    version_data: VersionSaveRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """保存版本（点击保存版本时调用）"""
    session = request.state.session
    version_service = VersionService(db)
    
    version = version_service.save_version(
        content=version_data.content,
        author=session["user_name"],
        author_id=session["user_id"],
        session_id=session["session_id"]
    )
    
    return success_response(data=version, message="版本保存成功")


@router.get("/api/versions")
async def get_versions(
    request: Request,
    limit: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """获取版本历史列表"""
    version_service = VersionService(db)
    versions = version_service.get_versions(limit=limit)
    
    return success_response(
        data={"versions": versions, "count": len(versions)},
        message="获取版本列表成功"
    )


@router.get("/api/versions/{version_id}")
async def get_version(
    version_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """获取指定版本"""
    version_service = VersionService(db)
    version = version_service.get_version_by_id(version_id)
    
    if not version:
        return not_found_response("版本不存在")
    
    return success_response(data=version, message="获取版本成功")
