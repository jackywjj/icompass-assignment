import type { RefObject } from 'react';
import { useState } from 'react';
import { Review } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useReviewManagement = (
  currentUser: { name: string },
  quillRef: RefObject<any>,
) => {
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  // 添加审阅
  const handleAddReview = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const selection = editor.getSelection();
    if (!selection || selection.length === 0) {
      alert('请先选择要审阅的文本');
      return;
    }

    const text = editor.getText(selection.index, selection.length);
    const review: Review = {
      id: uuidv4(),
      text,
      startIndex: selection.index,
      endIndex: selection.index + selection.length,
      author: currentUser.name,
      timestamp: Date.now(),
      status: 'pending',
      comments: [],
    };

    setReviews(prev => [...prev, review]);

    // 高亮标记
    editor.formatText(selection.index, selection.length, 'background', '#ffeb3b');
  };

  // 添加审阅评论
  const handleAddReviewComment = (reviewId: string) => {
    const commentText = window.prompt('请输入审阅意见：');
    if (!commentText) return;

    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          comments: [
            ...review.comments,
            {
              id: uuidv4(),
              text: commentText,
              author: currentUser.name,
              timestamp: Date.now(),
            },
          ],
        };
      }
      return review;
    }));
  };

  // 解决审阅
  const handleResolveReview = (reviewId: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return { ...review, status: 'resolved' as const };
      }
      return review;
    }));
  };

  return {
    isReviewMode,
    setIsReviewMode,
    reviews,
    handleAddReview,
    handleAddReviewComment,
    handleResolveReview,
  };
};
