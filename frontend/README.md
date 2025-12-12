# 前端项目 - 协同文本编辑器

基于 React + TypeScript 构建的现代化富文本编辑器前端应用。

## 技术参数

### 核心技术栈

- **框架**: React 18.2.0
- **语言**: TypeScript 5.2.2
- **构建工具**: Vite 5.0.8
- **包管理器**: pnpm
- **富文本编辑器**: Quill 1.3.7 + react-quill 2.0.0
- **路由**: react-router-dom 6.20.0
- **协同编辑**: Yjs 13.6.8（预留，当前为模拟实现）

### 开发工具

- **代码检查**: ESLint 9.39.1
- **类型检查**: TypeScript
- **构建优化**: Vite

### 环境要求

- Node.js 20+
- pnpm（推荐）或 npm/yarn

## 功能特性

### 文本编辑功能

- ✅ 富文本格式化（粗体、斜体、下划线、删除线）
- ✅ 文字颜色和背景色设置
- ✅ 字号和标题格式
- ✅ 有序/无序列表
- ✅ 段落对齐
- ✅ 链接和图片插入
- ✅ 一键清空内容

### 版本管理

- ✅ 保存文档版本（仅在有更改时）
- ✅ 查看版本历史列表
- ✅ 恢复历史版本
- ✅ 版本信息显示（作者、时间）

### 审阅功能

- ✅ 审阅模式开关
- ✅ 文本高亮标记
- ✅ 添加审阅意见
- ✅ 审阅状态管理（待审阅/已解决）

### 批注功能

- ✅ 文本批注添加
- ✅ 批注列表展示
- ✅ 批注回复功能
- ✅ 批注侧边栏

### 协同编辑

- ✅ 多用户协同（模拟实现）
- ✅ 协作者列表显示
- ✅ 光标位置同步（模拟）

### 其他功能

- ✅ 实时字数统计
- ✅ 本地存储备份
- ✅ 多环境配置（dev/uat/prd）
- ✅ 响应式设计

## 项目结构

```
frontend/
├── src/
│   ├── apis/                  # API 请求模块
│   │   ├── request.ts         # 请求封装
│   │   ├── article.ts         # 文章 API
│   │   ├── comment.ts         # 批注 API
│   │   └── index.ts           # 统一导出
│   ├── components/            # React 组件
│   │   ├── Editor.tsx         # 主编辑器组件
│   │   ├── EditorContent.tsx  # 编辑器内容区
│   │   ├── EditorToolbar.tsx  # 工具栏
│   │   ├── EditorSidebar.tsx  # 侧边栏
│   │   ├── EditorFooter.tsx   # 页脚
│   │   ├── VersionsPanel.tsx  # 版本面板
│   │   └── ReviewsPanel.tsx  # 审阅面板
│   ├── hooks/                 # 自定义 Hooks
│   │   ├── useEditorData.ts   # 编辑器数据管理
│   │   ├── useVersionManagement.ts  # 版本管理
│   │   ├── useReviewManagement.ts   # 审阅管理
│   │   ├── useCommentManagement.ts  # 批注管理
│   │   └── useWordCount.ts    # 字数统计
│   ├── types/                 # TypeScript 类型定义
│   │   ├── article.ts
│   │   ├── comment.ts
│   │   ├── review.ts
│   │   ├── user.ts
│   │   ├── version.ts
│   │   └── index.ts
│   ├── utils/                 # 工具函数
│   │   ├── storage.ts         # 本地存储
│   │   ├── user.ts            # 用户管理
│   │   └── collaboration.ts   # 协同服务（模拟）
│   ├── App.tsx                # 应用主组件
│   ├── main.tsx               # 应用入口
│   └── index.css              # 全局样式
├── .env                       # 默认环境配置
├── .env.dev                   # 开发环境配置
├── .env.uat                   # UAT 环境配置
├── .env.prd                   # 生产环境配置
├── index.html                 # HTML 模板
├── package.json               # 项目配置
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
└── README.md                  # 本文件
```

## 启动方式

### 安装依赖

```bash
pnpm install
```

或使用 npm：

```bash
npm install
```

### 开发模式

```bash
pnpm dev
```

应用将在 `http://localhost:3000` 启动，支持热重载。

### 构建生产版本

根据不同环境构建：

```bash
# 开发环境
pnpm run build:dev

# UAT 环境
pnpm run build:uat

# 生产环境
pnpm run build:prd
```

构建产物将输出到 `dist/` 目录。

### 预览生产版本

```bash
pnpm preview
```

### 代码检查

```bash
pnpm lint
```

## 环境配置

项目支持多环境配置，通过 `.env.*` 文件管理：

- `.env` - 默认开发环境
- `.env.dev` - 开发环境
- `.env.uat` - UAT 环境
- `.env.prd` - 生产环境

主要环境变量：

- `VITE_API_BASE_URL` - API 基础 URL
- `VITE_ENV` - 环境标识

## API 集成

前端通过 `src/apis` 目录下的模块与后端 API 交互：

- `apis/article.ts` - 文章相关 API（获取、保存、版本历史）
- `apis/comment.ts` - 批注相关 API（获取、保存）
- `apis/request.ts` - 请求封装（GET、POST 等方法）

1. 在 `src/types/` 定义类型（如需要）

## 相关链接

- [返回项目根目录](../README.md)
- [后端项目文档](../backend/README.md)
