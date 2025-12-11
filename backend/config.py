import os

# 数据存储路径
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

# 确保数据目录存在
os.makedirs(DATA_DIR, exist_ok=True)

# SQLite 数据库路径
DATABASE_URL = f"sqlite:///{os.path.join(DATA_DIR, 'database.db')}"
