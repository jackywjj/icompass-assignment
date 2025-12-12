# iCompass 协同编辑器

一个功能丰富的实时协同文本编辑器项目，支持多用户协同编辑、版本管理、审阅模式和批注功能。

## 项目简介

本项目是一个全栈协同文本编辑器应用，采用前后端分离架构：

- **前端**：基于 React + TypeScript 构建的现代化富文本编辑器
- **后端**：基于 FastAPI 的 RESTful API 服务

### 核心功能

- 📝 **富文本编辑**：支持丰富的文本格式化功能
- 👥 **协同编辑**：多用户实时协同编辑同一文档
- 📚 **版本管理**：文档版本历史记录和恢复功能
- ✍️ **审阅模式**：支持文本审阅和意见反馈
- 💬 **批注功能**：类似 Word/Google Docs 的批注系统
- 💾 **数据持久化**：后端数据库存储，前端本地缓存

## 项目结构

```
icompass-assignment/
├── frontend/          # 前端项目（React + TypeScript）
├── backend/           # 后端项目（FastAPI + SQLite）
└── README.md          # 本文件
```

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

## 详细文档

- 📖 [前端项目文档](./frontend/README.md) - 前端技术栈、功能说明、启动方式等
- 📖 [后端项目文档](./backend/README.md) - 后端技术栈、API 接口、启动方式等
