from fastapi import APIRouter, Request

from utils import success_response

router = APIRouter()


@router.get("/api/user")
async def get_user(request: Request):
    """获取当前用户信息"""
    session = request.state.session
    user_data = {
        "id": session["user_id"],
        "name": session["user_name"],
        "session_id": session["session_id"]
    }
    return success_response(data=user_data, message="获取用户信息成功")
