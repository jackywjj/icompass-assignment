export interface CommentReply {
  id: string;
  text: string;
  author: string;
  timestamp: number;
}

export interface Comment {
  id: string;
  text: string;
  targetText: string;
  startIndex: number;
  endIndex: number;
  author: string;
  timestamp: number;
  replies: CommentReply[];
}
