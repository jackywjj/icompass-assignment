import React from 'react';
import { Comment } from '../types';

interface EditorSidebarProps {
  showComments: boolean;
  comments: Comment[];
  onReplyComment: (commentId: string) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
                                                              showComments,
                                                              comments,
                                                              onReplyComment,
                                                            }) => {
  return (
    <div className={`sidebar ${showComments ? 'sidebar-open' : ''}`}>
      {showComments && (
        <div className='comments-panel'>
          <h3>批注列表</h3>
          {comments.length === 0 ? (
            <p className='empty-state'>暂无批注</p>
          ) : (
            <div className='comments-list'>
              {comments.map(comment => (
                <div key={comment.id} className='comment-item'>
                  <div className='comment-header'>
                    <span className='comment-author'>{comment.author}</span>
                    <span className='comment-time'>
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className='comment-target'>
                    批注文本: "{comment.targetText}"
                  </div>
                  <div className='comment-text'>{comment.text}</div>
                  <div className='comment-replies'>
                    {comment.replies.map(reply => (
                      <div key={reply.id} className='comment-reply'>
                        <span className='reply-author'>{reply.author}:</span>
                        <span className='reply-text'>{reply.text}</span>
                      </div>
                    ))}
                    <button
                      onClick={() => onReplyComment(comment.id)}
                      className='btn btn-small'
                      style={{ marginTop: '8px' }}
                    >
                      回复
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
