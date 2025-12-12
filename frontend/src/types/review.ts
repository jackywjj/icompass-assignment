export interface ReviewComment {
  id: string;
  text: string;
  author: string;
  timestamp: number;
}

export interface Review {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  author: string;
  timestamp: number;
  status: 'pending' | 'resolved';
  comments: ReviewComment[];
}
