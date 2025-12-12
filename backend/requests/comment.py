from pydantic import BaseModel


class CommentSaveRequest(BaseModel):
    """保存批注的请求模型"""
    text: str
    target_text: str
    start_index: int
    end_index: int
