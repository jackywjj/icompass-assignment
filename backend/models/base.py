from datetime import datetime
from typing import Dict, Any

from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.inspection import inspect
from sqlalchemy.sql import func

from database import Base


class BaseModel(Base):
    """基础模型类，包含公共属性和通用方法"""
    __abstract__ = True

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self, exclude: list = None) -> Dict[str, Any]:
        """
        转换为字典
        """
        if exclude is None:
            exclude = []

        result = {}
        mapper = inspect(self.__class__)

        if 'id' not in exclude and hasattr(self, 'id'):
            result['id'] = self.id

        for column in mapper.columns:
            column_name = column.name
            if column_name == 'id' or column_name in exclude:
                continue

            value = getattr(self, column_name, None)
            if isinstance(value, datetime):
                result[column_name] = value.isoformat() if value else None
            else:
                result[column_name] = value

        return result
