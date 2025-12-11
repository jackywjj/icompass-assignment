from datetime import datetime, timedelta
from typing import Dict, List
from fastapi import Request
from sqlalchemy.orm import Session
from models import Session as SessionModel


class SessionService:
    """Session 服务类"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_or_create_session(self, session_id: str, request: Request) -> Dict:
        """获取或创建 session"""
        session = self.db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
        
        if not session:
            # 创建新 session
            session = SessionModel(
                session_id=session_id,
                user_id=f"user_{session_id[:8]}",
                user_name=f"用户_{session_id[:8]}",
                ip=request.client.host if request.client else None,
                user_agent=request.headers.get("user-agent")
            )
            self.db.add(session)
            self.db.commit()
            self.db.refresh(session)
        else:
            # 更新最后活跃时间
            session.last_active = datetime.now()
            self.db.commit()
            self.db.refresh(session)
        
        return session.to_dict()
    
    def get_active_sessions(self, active_minutes: int = 5) -> List[Dict]:
        """获取活跃的 session"""
        cutoff_time = datetime.now() - timedelta(minutes=active_minutes)
        
        sessions = self.db.query(SessionModel).filter(
            SessionModel.last_active >= cutoff_time
        ).all()
        
        return [
            {
                "session_id": session.session_id,
                "user_name": session.user_name,
                "user_id": session.user_id,
                "last_active": session.last_active.isoformat() if session.last_active else None
            }
            for session in sessions
        ]
    
    def get_session_count(self) -> int:
        """获取 session 总数"""
        return self.db.query(SessionModel).count()
    
    def get_active_session_count(self, active_minutes: int = 5) -> int:
        """获取活跃 session 数量"""
        cutoff_time = datetime.now() - timedelta(minutes=active_minutes)
        return self.db.query(SessionModel).filter(
            SessionModel.last_active >= cutoff_time
        ).count()
