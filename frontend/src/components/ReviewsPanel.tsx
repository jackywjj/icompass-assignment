import React from 'react';
import { Review } from '../types';

interface ReviewsPanelProps {
  reviews: Review[];
  onAddComment: (reviewId: string) => void;
  onResolve: (reviewId: string) => void;
}

export const ReviewsPanel: React.FC<ReviewsPanelProps> = ({
                                                            reviews,
                                                            onAddComment,
                                                            onResolve,
                                                          }) => {
  if (reviews.length === 0) return null;

  return (
    <div className='reviews-panel'>
      <h3>审阅列表 ({reviews.length})</h3>
      {reviews.map(review => (
        <div key={review.id} className='review-item'>
          <div className='review-header'>
            <span className='review-author'>{review.author}</span>
            <span className='review-status'>{review.status === 'pending' ? '待审阅' : '已解决'}</span>
          </div>
          <div className='review-text'>"{review.text}"</div>
          {review.comments.length > 0 && (
            <div className='review-comments'>
              {review.comments.map(comment => (
                <div key={comment.id} className='review-comment'>
                  <span>{comment.author}: {comment.text}</span>
                </div>
              ))}
            </div>
          )}
          <div className='review-actions'>
            <button
              onClick={() => onAddComment(review.id)}
              className='btn btn-small'
            >
              添加意见
            </button>
            {review.status === 'pending' && (
              <button
                onClick={() => onResolve(review.id)}
                className='btn btn-small'
              >
                标记已解决
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
