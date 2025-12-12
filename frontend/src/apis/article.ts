import { request } from './request';

// 文章相关类型
export interface Article {
  id: number;
  content: string;
  author: string;
  author_id: string;
  session_id: string;
  timestamp: number;
  created_at?: string;
}

/**
 * 文章相关 API
 */
export const articleApi = {
  async getCurrentArticle(): Promise<Article | null> {
    const response = await request.get<Article>('/api/article/current');
    return response.data || null;
  },

  /**
   * 保存文章（保存版本，创建新记录）
   */
  async saveArticle(content: string): Promise<Article> {
    const response = await request.post<Article>('/api/article/current', { content });
    if (!response.data) {
      throw new Error('保存文章失败：响应数据为空');
    }
    return response.data;
  },

  /**
   * 获取所有文章（版本历史），按 id 倒序排列
   */
  async getAllArticles(limit?: number): Promise<Article[]> {
    const response = await request.get<{ articles: Article[] }>('/api/articles', {
      params: limit ? { limit } : undefined,
    });
    return response.data?.articles || [];
  },
};
