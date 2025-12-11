from typing import List
from fastapi import Request
from sqlalchemy.orm import Session
from sqlalchemy import desc
from models import RequestLog


class RequestService:
    """请求服务类"""
    
    def __init__(self, db: Session):
        self.db = db
        self.max_requests = 10000  # 最多保留的请求记录数
    
    def log_request(self, request: Request, session_id: str) -> None:
        """记录请求"""
        request_log = RequestLog(
            method=request.method,
            path=request.url.path,
            session_id=session_id,
            user_agent=request.headers.get("user-agent"),
            ip=request.client.host if request.client else None
        )
        
        self.db.add(request_log)
        self.db.commit()
        
        # 清理旧记录，只保留最近 N 条
        total_count = self.db.query(RequestLog).count()
        if total_count > self.max_requests:
            # 获取需要删除的记录 ID
            old_logs = self.db.query(RequestLog).order_by(
                RequestLog.timestamp
            ).limit(total_count - self.max_requests).all()
            
            for log in old_logs:
                self.db.delete(log)
            self.db.commit()
    
    def get_requests(self, limit: int = 100) -> List[dict]:
        """获取请求日志"""
        requests = self.db.query(RequestLog).order_by(
            desc(RequestLog.timestamp)
        ).limit(limit).all()
        
        return [req.to_dict() for req in requests]
    
    def get_request_count(self) -> int:
        """获取请求总数"""
        return self.db.query(RequestLog).count()
