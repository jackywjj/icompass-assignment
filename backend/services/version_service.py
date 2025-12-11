from datetime import datetime
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from models import Version


class VersionService:
    """版本服务类"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def save_version(
        self,
        content: str,
        author: str,
        author_id: str,
        session_id: str
    ) -> Dict:
        """保存版本"""
        version = Version(
            content=content,
            author=author,
            author_id=author_id,
            session_id=session_id,
            timestamp=int(datetime.now().timestamp() * 1000)
        )
        
        self.db.add(version)
        self.db.commit()
        self.db.refresh(version)
        
        return version.to_dict()
    
    def get_versions(self, limit: Optional[int] = None) -> List[Dict]:
        """获取版本列表，按时间倒序"""
        query = self.db.query(Version).order_by(desc(Version.timestamp))
        
        if limit:
            query = query.limit(limit)
        
        versions = query.all()
        return [version.to_dict() for version in versions]
    
    def get_version_by_id(self, version_id: int) -> Optional[Dict]:
        """根据 ID 获取版本"""
        version = self.db.query(Version).filter(Version.id == version_id).first()
        return version.to_dict() if version else None
    
    def get_version_count(self) -> int:
        """获取版本总数"""
        return self.db.query(Version).count()
