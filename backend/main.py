from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers import (
    health_router,
    user_router,
    article_router,
    session_router,
    request_router,
    comment_router
)
from database import init_db
from middleware.session_middleware import SessionMiddleware
# 导入所有模型以确保 SQLAlchemy 能够识别它们
from models import Article, Comment, Session, RequestLog

# 初始化数据库
init_db()

# 创建 FastAPI 应用
app = FastAPI(title="协同编辑器后端服务")

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite 默认端口
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 添加 Session 中间件
app.add_middleware(SessionMiddleware)

# 注册路由
app.include_router(health_router)
app.include_router(user_router)
app.include_router(article_router)
app.include_router(session_router)
app.include_router(request_router)
app.include_router(comment_router)

if __name__ == "__main__":
    import uvicorn
    import logging

    # 配置日志只输出到控制台，不保存到文件
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler()]  # 只使用控制台输出
    )

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_config=None  # 使用上面的 logging 配置，不保存到文件
    )
