from typing import Any, Optional, Dict

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
        status_code: int = 400,
        error_code: Optional[str] = None
) -> JSONResponse:
    """错误响应"""
    content = {
        "success": False,
        "message": message
    }
    if error_code:
        content["error_code"] = error_code

    return JSONResponse(
        status_code=status_code,
        content=content
    )


def not_found_response(message: str = "资源不存在") -> JSONResponse:
    """404 响应"""
    return error_response(message=message, status_code=404)


def server_error_response(message: str = "服务器内部错误") -> JSONResponse:
    """500 响应"""
    return error_response(message=message, status_code=500)
