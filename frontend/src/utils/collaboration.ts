import { User } from '../types'

// 模拟 WebSocket 连接（实际项目中应使用真实的 WebSocket 服务器）
class CollaborationService {
  private listeners: Map<string, Set<Function>> = new Map()
  private users: Map<string, User> = new Map()
  private currentUser: User | null = null

  connect(user: User) {
    this.currentUser = user
    this.users.set(user.id, user)
    this.emit('user-joined', user)
    
    // 模拟定期更新光标位置
    setInterval(() => {
      if (this.currentUser) {
        this.emit('cursor-update', {
          userId: this.currentUser.id,
          cursor: this.currentUser.cursor
        })
      }
    }, 1000)
  }

  disconnect() {
    if (this.currentUser) {
      this.emit('user-left', this.currentUser.id)
      this.users.delete(this.currentUser.id)
      this.currentUser = null
    }
  }

  updateCursor(userId: string, cursor: { index: number; length: number }) {
    const user = this.users.get(userId)
    if (user) {
      user.cursor = cursor
      this.emit('cursor-update', { userId, cursor })
    }
  }

  updateContent(content: string) {
    this.emit('content-update', content)
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }

  getUsers(): User[] {
    return Array.from(this.users.values())
  }
}

export const collaborationService = new CollaborationService()

