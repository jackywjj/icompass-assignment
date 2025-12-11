# iCompass 协同编辑器

一个功能丰富的实时协同文本编辑器项目，包含前端（React + TypeScript）和后端（FastAPI）两个部分。

## 项目概述

本项目是一个全栈协同文本编辑器应用，支持多用户实时协同编辑、版本管理、审阅模式和批注功能。

### 前端项目

基于 React + TypeScript 构建的富文本编辑器前端应用。

### 后端项目

基于 FastAPI 的后端服务，用于支持协同文本编辑器的功能。

---

## 前端项目 (frontend/)

### 功能特性

#### 文本编辑基础功能
- ✅ 支持文本输入、编辑和实时显示
- ✅ 富文本格式化（粗体、斜体、下划线、删除线）
- ✅ 支持文字颜色和字号设置
- ✅ 支持有序/无序列表
- ✅ 支持段落格式和标题

#### 文本管理
- ✅ 支持一键清空所有文本内容
- ✅ 支持将文本内容保存到浏览器本地存储（LocalStorage）

#### 字数统计
- ✅ 实时显示文档字数统计信息（字数、字符数）

#### 实时协同编辑
- ✅ 支持多用户同时编辑同一文档（模拟实现）
- ✅ 实时显示各用户光标位置和编辑状态
- ✅ 用户可看到其他协作者的光标位置和状态

#### 版本历史
- ✅ 支持文档历史版本存档
- ✅ 支持查看和恢复历史版本

#### 审阅模式
- ✅ 支持审阅模式，可高亮标记需要审阅的文本
- ✅ 审阅完成后，其他用户可查看审阅内容
- ✅ 支持添加审阅意见和标记已解决

#### 批注功能
- ✅ 支持对文本添加批注（参考 Microsoft Word、Google Docs 的批注功能）
- ✅ 批注可显示在文档侧边
- ✅ 支持批注的添加、查看和回复

### 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **包管理器**: pnpm
- **富文本编辑器**: Quill
- **Node 版本**: 20

### 安装和运行

#### 前置要求
- Node.js 20+
- pnpm

#### 安装依赖
```bash
cd frontend
pnpm install
```

#### 开发模式
```bash
pnpm dev
```

应用将在 http://localhost:3000 启动

#### 构建生产版本
```bash
pnpm build
```

#### 预览生产版本
```bash
pnpm preview
```

### 项目结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── Editor.tsx          # 主编辑器组件
│   │   └── Editor.css          # 编辑器样式
│   ├── types/
│   │   └── index.ts            # TypeScript 类型定义
│   ├── utils/
│   │   ├── storage.ts          # 本地存储工具
│   │   ├── user.ts             # 用户管理工具
│   │   ├── collaboration.ts    # 协同编辑服务（模拟）
│   │   └── api.ts              # API 调用工具
│   ├── App.tsx                 # 应用主组件
│   ├── App.css                 # 应用样式
│   ├── main.tsx                # 应用入口
│   └── index.css               # 全局样式
├── index.html                  # HTML 模板
├── package.json                # 项目配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
└── README.md                   # 项目说明
```

### 使用说明

#### 基本编辑
1. 在编辑器中直接输入文本
2. 使用工具栏进行格式化（粗体、斜体、颜色、字号等）
3. 内容会自动保存到本地存储

#### 版本管理
1. 点击"保存版本"按钮保存当前版本
2. 点击"版本历史"查看所有历史版本
3. 点击"恢复"按钮可以恢复到指定版本

#### 审阅模式
1. 点击"审阅模式"按钮启用审阅模式
2. 选择需要审阅的文本
3. 点击"添加审阅"按钮添加审阅标记
4. 在审阅面板中可以添加审阅意见
5. 审阅完成后可以标记为"已解决"

#### 批注功能
1. 选择要批注的文本
2. 点击"添加批注"按钮
3. 输入批注内容
4. 点击"批注"按钮查看所有批注
5. 在批注列表中可以对批注进行回复

#### 协同编辑
- 当前版本使用模拟的协同编辑服务
- 在实际部署中，需要配置真实的 WebSocket 服务器
- 建议使用 Yjs + WebSocket 实现真正的实时协同编辑

### 注意事项

1. **实时协同编辑**: 当前实现为模拟版本，实际生产环境需要配置 WebSocket 服务器
2. **数据存储**: 所有数据存储在浏览器本地，清除浏览器数据会丢失内容
3. **版本限制**: 版本历史最多保留 50 个版本
4. **浏览器兼容性**: 建议使用现代浏览器（Chrome、Firefox、Safari、Edge）

---

## 后端项目 (backend/)

### 功能特性

- ✅ 记录所有前端请求
- ✅ 保存文章（每次前端保存时在后端创建一条记录）
- ✅ 基于 Session 的用户管理（每个浏览器 session 作为一个用户）
- ✅ 支持协同操作（可以查看所有活跃的 session）
- ✅ 使用 SQLite 数据库作为本地存储（通过 SQLAlchemy ORM）

### 技术栈

- **框架**: FastAPI
- **语言**: Python
- **数据库**: SQLite
- **ORM**: SQLAlchemy
- **数据验证**: Pydantic

### 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 启动服务

```bash
python main.py
```

或者使用 uvicorn：

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

服务将在 `http://localhost:8000` 启动。

### 项目结构

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
│   ├── comment_controller.py
│   ├── session_controller.py
│   ├── request_controller.py
│   ├── stats_controller.py
│   └── version_controller.py
├── services/              # 服务层（业务逻辑）
│   ├── __init__.py
│   ├── article_service.py
│   ├── comment_service.py
│   ├── session_service.py
│   ├── request_service.py
│   └── version_service.py
├── models/                # 数据模型
│   ├── __init__.py
│   ├── article.py         # Pydantic 请求/响应模型
│   ├── comment.py         # Pydantic 请求/响应模型
│   ├── request_log.py     # Pydantic 请求/响应模型
│   ├── session.py         # Pydantic 请求/响应模型
│   └── version.py         # Pydantic 请求/响应模型
├── beans/                 # 数据实体（SQLAlchemy 模型）
│   ├── __init__.py
│   ├── article.py
│   ├── comment.py
│   ├── request_log.py
│   ├── session.py
│   └── version.py
├── middleware/            # 中间件
│   ├── __init__.py
│   └── session_middleware.py
├── utils/                 # 工具函数
│   ├── __init__.py
│   └── response.py        # 响应工具
└── data/                  # 数据存储目录（自动创建）
    └── database.db        # SQLite 数据库文件
```

### API 接口

#### 健康检查
- `GET /health` - 服务健康检查

#### 用户相关
- `GET /api/user` - 获取当前用户信息

#### 文章相关
- `POST /api/articles` - 保存文章
  ```json
  {
    "content": "文章内容",
    "doc_id": "文档ID（可选）"
  }
  ```
- `GET /api/articles` - 获取所有文章（支持 `doc_id` 查询参数过滤）
- `GET /api/articles/{article_id}` - 获取指定文章

#### Session 相关
- `GET /api/sessions` - 获取所有活跃的 session（用于协同操作）

#### 请求日志
- `GET /api/requests` - 获取请求日志（支持 `limit` 查询参数，默认 100）

#### 统计信息
- `GET /api/stats` - 获取统计信息

### 数据存储

使用 SQLite 数据库存储所有数据，数据库文件位于 `backend/data/database.db`。

数据库包含以下表：
- `articles` - 文章记录表
- `sessions` - Session 信息表
- `request_logs` - 请求日志表
- `comments` - 批注表
- `versions` - 版本历史表

数据库会在首次启动时自动创建。使用 SQLAlchemy ORM 框架进行数据操作。

### Session 管理

- 每个浏览器 session 通过 cookie 中的 `session_id` 标识
- Session 自动创建，30 天有效期
- 每个 session 对应一个用户，用户名为 `用户_{session_id前8位}`

### 代码架构说明

项目采用分层架构设计：

- **Controllers（控制器层）**：负责处理 HTTP 请求和响应，调用服务层处理业务逻辑，使用 FastAPI 的依赖注入获取数据库会话
- **Services（服务层）**：包含核心业务逻辑，处理数据操作，通过 SQLAlchemy ORM 与数据库交互
- **Models（模型层）**：Pydantic 请求/响应模型
- **Beans（实体层）**：SQLAlchemy 数据库模型（Article, Session, RequestLog, Comment, Version）
- **Database（数据库层）**：数据库配置、连接管理和初始化
- **Middleware（中间件）**：处理 Session 管理和请求日志记录
- **Config（配置层）**：统一管理配置信息，如数据库路径

这种结构使代码更加清晰、易于维护和扩展。使用 SQLAlchemy ORM 提供了更好的数据一致性和查询能力。

---

## 快速开始

### 1. 启动后端服务

```bash
cd backend
pip install -r requirements.txt
python main.py
```

后端服务将在 `http://localhost:8000` 启动。

### 2. 启动前端应用

```bash
cd frontend
pnpm install
pnpm dev
```

前端应用将在 `http://localhost:3000` 启动。

### 3. 访问应用

打开浏览器访问 `http://localhost:3000` 即可开始使用协同编辑器。

---

## 开发说明

### 环境要求

- **后端**: Python 3.8+
- **前端**: Node.js 20+, pnpm

### 项目结构

```
icompass-assignment/
├── backend/          # 后端服务（FastAPI）
├── frontend/         # 前端应用（React + TypeScript）
├── .gitignore        # Git 忽略文件（支持 Python 和 Node.js）
└── README.md         # 项目说明文档
```

---

## 未来改进

- [ ] 集成真实的 WebSocket 服务器实现真正的实时协同
- [ ] 添加用户认证和权限管理
- [ ] 支持云端存储和同步
- [ ] 优化移动端体验
- [ ] 添加更多富文本格式选项
- [ ] 支持导出为 PDF、Word 等格式

---

## 许可证

MIT

