# 后端项目 - 协同编辑器 API 服务

基于 FastAPI 的后端服务，提供协同文本编辑器的 RESTful API 接口。

## 技术参数

### 核心技术栈

- **框架**: FastAPI 0.104.1
- **语言**: Python 3.8+
- **数据库**: SQLite（通过 SQLAlchemy ORM）
- **ORM**: SQLAlchemy 2.0.23
- **数据验证**: Pydantic 2.5.0
- **ASGI 服务器**: Uvicorn 0.24.0

### 开发工具

- **类型提示**: Python 类型注解
- **API 文档**: FastAPI 自动生成（Swagger UI）

### 环境要求

- Python 3.8+
- pip 或 conda

## 功能特性

### 文章管理

- ✅ 获取当前文章（返回最新的非空文章）
- ✅ 保存文章版本（仅保存非空内容）
- ✅ 获取所有文章（版本历史）
- ✅ 自动过滤空内容

### 批注管理

- ✅ 保存批注
- ✅ 获取所有批注
- ✅ 批注信息包含作者、时间、位置等

### Session 管理

- ✅ 自动创建和管理用户 Session
- ✅ 基于 Cookie 的 Session 标识
- ✅ Session 有效期 30 天
- ✅ 获取活跃 Session 列表

### 用户管理

- ✅ 基于 Session 的用户识别
- ✅ 自动生成用户名
- ✅ 用户信息获取

### 其他功能

- ✅ 健康检查接口
- ✅ CORS 跨域支持
- ✅ 自动 API 文档生成

## 项目结构

```
backend/
├── main.py                    # 应用入口文件
├── config.py                  # 配置文件
├── database.py                # 数据库配置和初始化
├── requirements.txt           # Python 依赖
├── controllers/               # 控制器层（路由处理）
│   ├── __init__.py
│   ├── health_controller.py   # 健康检查
│   ├── user_controller.py     # 用户相关
│   ├── article_controller.py  # 文章相关
│   ├── comment_controller.py  # 批注相关
│   └── session_controller.py  # Session 相关
├── services/                  # 服务层（业务逻辑）
│   ├── __init__.py
│   ├── article_service.py     # 文章服务
│   ├── comment_service.py     # 批注服务
│   └── session_service.py     # Session 服务
├── models/                    # 数据模型（SQLAlchemy）
│   ├── __init__.py
│   ├── base.py                # 基础模型类
│   ├── article.py             # 文章模型
│   ├── comment.py             # 批注模型
│   └── session.py             # Session 模型
├── requests/                  # 请求/响应模型（Pydantic）
│   ├── __init__.py
│   ├── article.py             # 文章请求模型
│   └── comment.py             # 批注请求模型
├── middleware/                # 中间件
│   ├── __init__.py
│   └── session_middleware.py  # Session 中间件
├── utils/                     # 工具函数
│   ├── __init__.py
│   └── response.py            # 响应工具
└── data/                      # 数据存储目录（自动创建）
    └── database.db            # SQLite 数据库文件
```

## 启动方式

### 安装依赖

```bash
pip install -r requirements.txt
```

或使用虚拟环境：

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 启动服务

#### 方式一：直接运行

```bash
python main.py
```

#### 方式二：使用 uvicorn

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

参数说明：
- `--reload`: 开发模式，代码变更自动重载
- `--host 0.0.0.0`: 监听所有网络接口
- `--port 8000`: 服务端口

服务启动后：
- API 服务：`http://localhost:8000`
- API 文档：`http://localhost:8000/docs`（Swagger UI）
- 替代文档：`http://localhost:8000/redoc`（ReDoc）

## 数据存储

### 数据库

使用 SQLite 数据库，数据库文件位于 `backend/data/database.db`。

数据库会在首次启动时自动创建。

### 数据表结构

- **articles** - 文章表
  - `id` - 主键
  - `content` - 文章内容
  - `author` - 作者
  - `author_id` - 作者 ID
  - `session_id` - Session ID
  - `timestamp` - 时间戳（毫秒）
  - `created_at` - 创建时间

- **comments** - 批注表
  - `id` - 主键
  - `text` - 批注内容
  - `target_text` - 被批注的文本
  - `start_index` - 起始位置
  - `end_index` - 结束位置
  - `author` - 作者
  - `author_id` - 作者 ID
  - `session_id` - Session ID
  - `timestamp` - 时间戳（毫秒）
  - `created_at` - 创建时间

- **sessions** - Session 表
  - `id` - 主键
  - `session_id` - Session 标识（唯一）
  - `user_id` - 用户 ID
  - `user_name` - 用户名
  - `ip` - IP 地址
  - `user_agent` - 用户代理
  - `created_at` - 创建时间
  - `last_active` - 最后活跃时间

## Session 管理

### Session 机制

- 每个浏览器通过 Cookie 中的 `session_id` 标识
- Session 自动创建，无需手动注册
- Session 有效期 30 天
- 每个 Session 对应一个用户

### 用户命名规则

- 用户名格式：`用户_{session_id前8位}`
- 用户 ID 格式：`user_{session_id前8位}`

### 活跃 Session 判断

- 默认：最近 5 分钟内活跃的 Session
- 可通过 `active_minutes` 参数调整

## 配置说明

### 数据库配置

数据库配置在 `config.py` 中：


## 注意事项

1. **数据库文件**：`data/database.db` 会在首次启动时自动创建
2. **空内容处理**：保存和获取文章时会自动过滤空内容
3. **Session 管理**：Session 通过 Cookie 自动管理，无需手动处理
4. **API 文档**：访问 `/docs` 查看完整的 API 文档

## 相关链接

- [返回项目根目录](../README.md)
- [前端项目文档](../frontend/README.md)
