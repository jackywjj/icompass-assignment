// 统一导出所有 API
export * from './request';
export * from './article';
export * from './comment';

// 导出 API 对象
import { articleApi } from './article';
import { commentApi } from './comment';

export const api = {
  // 文章相关
  getCurrentArticle: articleApi.getCurrentArticle,
  saveArticle: articleApi.saveArticle,
  getAllArticles: articleApi.getAllArticles,

  // 批注相关
  getComments: commentApi.getComments,
  saveComment: commentApi.saveComment,
};
