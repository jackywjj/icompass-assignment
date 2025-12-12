import React from 'react';

interface EditorToolbarProps {
  onClear: () => void;
  onSaveVersion: () => void | Promise<void>;
  showVersions: boolean;
  onToggleVersions: () => void;
  isReviewMode: boolean;
  onToggleReviewMode: () => void;
  showComments: boolean;
  onToggleComments: () => void;
  commentsCount: number;
  onAddReview: () => void;
  onAddComment: () => void;
  hasChanges: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
                                                              onClear,
                                                              onSaveVersion,
                                                              onToggleVersions,
                                                              isReviewMode,
                                                              onToggleReviewMode,
                                                              onToggleComments,
                                                              commentsCount,
                                                              onAddReview,
                                                              onAddComment,
                                                              hasChanges,
                                                            }) => {
  return (
    <div className='editor-toolbar'>
      <div className='toolbar-left'>
        <h1>协同文本编辑器</h1>
      </div>
      <div className='toolbar-right'>
        <button onClick={onClear} className='btn btn-secondary'>清空</button>
        <button 
          onClick={onSaveVersion} 
          className='btn btn-primary'
          disabled={!hasChanges}
          title={hasChanges ? '保存当前版本' : '内容未更改，无法保存'}
        >
          保存版本
        </button>
        <button
          onClick={onToggleVersions}
          className='btn btn-secondary'
        >
          版本历史
        </button>
        <button
          onClick={onToggleReviewMode}
          className={`btn ${isReviewMode ? 'btn-active' : 'btn-secondary'}`}
        >
          审阅模式
        </button>
        <button
          onClick={onToggleComments}
          className='btn btn-secondary'
        >
          批注 ({commentsCount})
        </button>
        {isReviewMode && (
          <button onClick={onAddReview} className='btn btn-primary'>
            添加审阅
          </button>
        )}
        <button onClick={onAddComment} className='btn btn-primary'>
          添加批注
        </button>
      </div>
    </div>
  );
};
