import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from database import SessionLocal
from services import SessionService
from services.request_service import RequestService


class SessionMiddleware(BaseHTTPMiddleware):
    """Session 中间件"""
    
    def __init__(self, app):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next):
        # 创建数据库会话
        db = SessionLocal()
        
        try:
            # 获取或创建 session_id
            session_id = request.cookies.get("session_id")
            if not session_id:
                session_id = str(uuid.uuid4())
            
            # 获取或创建 session
            session_service = SessionService(db)
            session = session_service.get_or_create_session(session_id, request)
            
            # 记录请求（排除健康检查）
            if request.url.path != "/health":
                request_service = RequestService(db)
                request_service.log_request(request, session_id)
            
            # 将 session 信息添加到 request state
            request.state.session_id = session_id
            request.state.session = session
            request.state.db = db  # 将数据库会话也添加到 request state
            
            # 处理请求
            response = await call_next(request)
            
            # 设置 session cookie
            response.set_cookie(
                key="session_id",
                value=session_id,
                max_age=86400 * 30,  # 30 天
                httponly=True,
                samesite="lax"
            )
            
            return response
        finally:
            db.close()
