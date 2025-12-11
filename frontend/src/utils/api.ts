// API 配置
const API_BASE_URL = 'http://127.0.0.1:8000'

// API 响应类型
interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error_code?: string
}

// API 请求工具函数
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include', // 包含 cookies
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '请求失败')
      }

      return data
    } catch (error) {
      console.error('API 请求错误:', error)
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// 创建 API 客户端实例
export const apiClient = new ApiClient(API_BASE_URL)

// API 接口函数
export const api = {
  // 获取当前文章（按 id 倒序，第一条为最近的一条记录）
  async getCurrentArticle() {
    const response = await apiClient.get('/api/article/current')
    return response.data
  },

  // 保存文章（保存版本，创建新记录）
  async saveArticle(content: string) {
    const response = await apiClient.post('/api/article/current', { content })
    return response.data
  },

  // 获取所有文章（版本历史），按 id 倒序排列
  async getAllArticles(limit?: number) {
    const endpoint = limit ? `/api/articles?limit=${limit}` : '/api/articles'
    const response = await apiClient.get<{ articles: any[] }>(endpoint)
    return response.data?.articles || []
  },

  // 获取所有批注
  async getComments() {
    const response = await apiClient.get<{ comments: any[] }>('/api/comments')
    return response.data?.comments || []
  },

  // 保存批注
  async saveComment(comment: {
    text: string
    target_text: string
    start_index: number
    end_index: number
  }) {
    const response = await apiClient.post('/api/comments', comment)
    return response.data
  },

  // 删除批注
  async deleteComment(commentId: string) {
    return await apiClient.delete(`/api/comments/${commentId}`)
  },
}
