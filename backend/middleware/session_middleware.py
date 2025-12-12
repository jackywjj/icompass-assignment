import uuid

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from database import SessionLocal
from services import SessionService


class SessionMiddleware(BaseHTTPMiddleware):
    """Session 中间件"""

    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        db = SessionLocal()

        try:
            session_id = request.cookies.get("session_id")
            if not session_id:
                session_id = str(uuid.uuid4())

            session_service = SessionService(db)
            session = session_service.get_or_create_session(session_id, request)

            # 将 session 信息添加到 request state
            request.state.session_id = session_id
            request.state.session = session
            request.state.db = db

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
