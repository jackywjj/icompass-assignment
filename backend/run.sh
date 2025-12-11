#!/bin/bash

# 启动后端服务脚本

echo "正在启动协同编辑器后端服务..."
echo "服务将在 http://localhost:8000 启动"
echo "API 文档可在 http://localhost:8000/docs 查看"
echo ""

# 检查是否安装了依赖
if [ ! -d "venv" ] && [ ! -d "env" ]; then
    echo "检测到未创建虚拟环境，建议先创建虚拟环境："
    echo "  python3 -m venv venv"
    echo "  source venv/bin/activate  # Linux/Mac"
    echo "  venv\\Scripts\\activate  # Windows"
    echo "  pip install -r requirements.txt"
    echo ""
fi

# 启动服务
python main.py
