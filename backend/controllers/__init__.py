from .health_controller import router as health_router
from .user_controller import router as user_router
from .article_controller import router as article_router
from .session_controller import router as session_router
from .request_controller import router as request_router
from .stats_controller import router as stats_router
from .version_controller import router as version_router
from .comment_controller import router as comment_router

__all__ = [
    "health_router",
    "user_router",
    "article_router",
    "session_router",
    "request_router",
    "stats_router",
    "version_router",
    "comment_router"
]
