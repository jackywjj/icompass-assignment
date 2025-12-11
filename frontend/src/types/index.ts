export interface User {
  id: string
  name: string
  color: string
  cursor?: {
    index: number
    length: number
  }
}

export interface Version {
  id: number
  timestamp: number
  content: string
  author: string
}

export interface Review {
  id: string
  text: string
  startIndex: number
  endIndex: number
  author: string
  timestamp: number
  status: 'pending' | 'resolved'
  comments: ReviewComment[]
}

export interface ReviewComment {
  id: string
  text: string
  author: string
  timestamp: number
}

export interface Comment {
  id: string
  text: string
  targetText: string
  startIndex: number
  endIndex: number
  author: string
  timestamp: number
  replies: CommentReply[]
}

export interface CommentReply {
  id: string
  text: string
  author: string
  timestamp: number
}

