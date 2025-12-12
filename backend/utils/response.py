from typing import Any, Dict

from fastapi.responses import JSONResponse


def success_response(
        data: Any = None,
        message: str = "操作成功",
        status_code: int = 200
) -> Dict[str, Any]:
    """成功响应"""
    response = {
        "success": True,
        "message": message
    }
    if data is not None:
        response["data"] = data
    return response


def error_response(
        message: str = "操作失败",
        status_code: int = 400
) -> JSONResponse:
    """错误响应"""
    content = {
        "success": False,
        "message": message
    }

    return JSONResponse(
        status_code=status_code,
        content=content
    )


def not_found_response(message: str = "资源不存在") -> JSONResponse:
    """404 响应"""
    return error_response(message=message, status_code=404)
