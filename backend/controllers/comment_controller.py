from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session

from requests import CommentSaveRequest
from database import get_db
from services import CommentService
from utils import success_response

router = APIRouter()


@router.post("/api/comments")
async def save_comment(
        comment_data: CommentSaveRequest,
        request: Request,
        db: Session = Depends(get_db)
):
    """保存批注"""
    session = request.state.session
    comment_service = CommentService(db)

    comment = comment_service.save_comment(
        text=comment_data.text,
        target_text=comment_data.target_text,
        start_index=comment_data.start_index,
        end_index=comment_data.end_index,
        author=session["user_name"],
        author_id=session["user_id"],
        session_id=session["session_id"]
    )

    return success_response(data=comment, message="批注保存成功")


@router.get("/api/comments")
async def get_comments(
        request: Request,
        db: Session = Depends(get_db)
):
    """获取所有批注"""
    comment_service = CommentService(db)
    comments = comment_service.get_comments()

    return success_response(
        data={"comments": comments, "count": len(comments)},
        message="获取批注列表成功"
    )
