import { request } from './request';

// 批注相关类型
export interface Comment {
  id: number;
  text: string;
  target_text: string;
  start_index: number;
  end_index: number;
  author: string;
  author_id: string;
  session_id: string;
  timestamp: number;
  created_at?: string;
}

export interface CommentSaveRequest {
  text: string;
  target_text: string;
  start_index: number;
  end_index: number;
}

/**
 * 批注相关 API
 */
export const commentApi = {
  /**
   * 获取所有批注
   */
  async getComments(): Promise<Comment[]> {
    const response = await request.get<{ comments: Comment[] }>('/api/comments');
    return response.data?.comments || [];
  },

  /**
   * 保存批注
   */
  async saveComment(comment: CommentSaveRequest): Promise<Comment> {
    const response = await request.post<Comment>('/api/comments', comment);
    if (!response.data) {
      throw new Error('保存批注失败：响应数据为空');
    }
    return response.data;
  },
};
