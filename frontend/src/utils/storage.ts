const STORAGE_KEY = 'collaborative-editor-doc'
const VERSIONS_KEY = 'collaborative-editor-versions'

export const storage = {
  save(content: string): void {
    try {
      localStorage.setItem(STORAGE_KEY, content)
    } catch (error) {
      console.error('保存到本地存储失败:', error)
    }
  },

  load(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch (error) {
      console.error('从本地存储加载失败:', error)
      return null
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('清空本地存储失败:', error)
    }
  },

  saveVersion(version: { id: string; timestamp: number; content: string; author: string }): void {
    try {
      const versions = storage.getVersions()
      versions.push(version)
      // 只保留最近50个版本
      const recentVersions = versions.slice(-50)
      localStorage.setItem(VERSIONS_KEY, JSON.stringify(recentVersions))
    } catch (error) {
      console.error('保存版本失败:', error)
    }
  },

  getVersions(): Array<{ id: string; timestamp: number; content: string; author: string }> {
    try {
      const data = localStorage.getItem(VERSIONS_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('获取版本列表失败:', error)
      return []
    }
  }
}

