from .health_controller import router as health_router
from .user_controller import router as user_router
from .article_controller import router as article_router
from .session_controller import router as session_router
from .comment_controller import router as comment_router

__all__ = [
    "health_router",
    "user_router",
    "article_router",
    "session_router",
    "comment_router"
]
