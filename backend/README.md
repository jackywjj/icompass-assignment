# iCompass 协同编辑器后端服务

基于 FastAPI 的后端服务，用于支持协同文本编辑器的功能。

## 项目结构

```
backend/
├── main.py                 # 应用入口文件
├── config.py              # 配置文件（数据库路径等）
├── database.py            # 数据库配置和初始化
├── requirements.txt       # Python 依赖
├── controllers/           # 控制器层（路由处理）
│   ├── __init__.py
│   ├── health_controller.py
│   ├── user_controller.py
│   ├── article_controller.py
│   ├── session_controller.py
│   ├── request_controller.py
│   └── stats_controller.py
├── services/              # 服务层（业务逻辑）
│   ├── __init__.py
│   ├── article_service.py
│   ├── session_service.py
│   └── request_service.py
├── models/                # 数据模型
│   ├── __init__.py
│   ├── article.py         # Pydantic 请求/响应模型
│   ├── request_log.py     # Pydantic 请求/响应模型
│   └── db_models.py       # SQLAlchemy 数据库模型
├── middleware/            # 中间件
│   ├── __init__.py
│   └── session_middleware.py
├── utils/                 # 工具函数（预留）
│   └── __init__.py
└── data/                  # 数据存储目录（自动创建）
    └── database.db        # SQLite 数据库文件
```

## 功能特性

- ✅ 记录所有前端请求
- ✅ 保存文章（每次前端保存时在后端创建一条记录）
- ✅ 基于 Session 的用户管理（每个浏览器 session 作为一个用户）
- ✅ 支持协同操作（可以查看所有活跃的 session）
- ✅ 使用 SQLite 数据库作为本地存储（通过 SQLAlchemy ORM）

## 安装依赖

```bash
pip install -r requirements.txt
```

## 启动服务

```bash
python main.py
```

或者使用 uvicorn：

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

服务将在 `http://localhost:8000` 启动。

## API 接口

### 健康检查
- `GET /health` - 服务健康检查

### 用户相关
- `GET /api/user` - 获取当前用户信息

### 文章相关
- `POST /api/articles` - 保存文章
  ```json
  {
    "content": "文章内容",
    "doc_id": "文档ID（可选）"
  }
  ```
- `GET /api/articles` - 获取所有文章（支持 `doc_id` 查询参数过滤）
- `GET /api/articles/{article_id}` - 获取指定文章

### Session 相关
- `GET /api/sessions` - 获取所有活跃的 session（用于协同操作）

### 请求日志
- `GET /api/requests` - 获取请求日志（支持 `limit` 查询参数，默认 100）

### 统计信息
- `GET /api/stats` - 获取统计信息

## 数据存储

使用 SQLite 数据库存储所有数据，数据库文件位于 `backend/data/database.db`。

数据库包含以下表：
- `articles` - 文章记录表
- `sessions` - Session 信息表
- `request_logs` - 请求日志表

数据库会在首次启动时自动创建。使用 SQLAlchemy ORM 框架进行数据操作。

## Session 管理

- 每个浏览器 session 通过 cookie 中的 `session_id` 标识
- Session 自动创建，30 天有效期
- 每个 session 对应一个用户，用户名为 `用户_{session_id前8位}`

## 代码架构说明

项目采用分层架构设计：

- **Controllers（控制器层）**：负责处理 HTTP 请求和响应，调用服务层处理业务逻辑，使用 FastAPI 的依赖注入获取数据库会话
- **Services（服务层）**：包含核心业务逻辑，处理数据操作，通过 SQLAlchemy ORM 与数据库交互
- **Models（模型层）**：
  - `db_models.py`：SQLAlchemy 数据库模型（Article, Session, RequestLog）
  - `article.py`、`request_log.py`：Pydantic 请求/响应模型
- **Database（数据库层）**：数据库配置、连接管理和初始化
- **Middleware（中间件）**：处理 Session 管理和请求日志记录
- **Config（配置层）**：统一管理配置信息，如数据库路径

这种结构使代码更加清晰、易于维护和扩展。使用 SQLAlchemy ORM 提供了更好的数据一致性和查询能力。
