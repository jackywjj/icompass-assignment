from fastapi import APIRouter
from utils import success_response

router = APIRouter()


@router.get("/health")
async def health():
    """健康检查"""
    return success_response(data={"status": "ok"}, message="服务运行正常")
