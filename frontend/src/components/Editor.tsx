import { useEditorData } from '../hooks/useEditorData';
import { useVersionManagement } from '../hooks/useVersionManagement';
import { useReviewManagement } from '../hooks/useReviewManagement';
import { useCommentManagement } from '../hooks/useCommentManagement';
import { useWordCount } from '../hooks/useWordCount';
import { EditorToolbar } from './EditorToolbar';
import { EditorContent } from './EditorContent';
import { EditorSidebar } from './EditorSidebar';
import { EditorFooter } from './EditorFooter';
import { VersionsPanel } from './VersionsPanel';
import { ReviewsPanel } from './ReviewsPanel';
import './Editor.css';

const Editor = () => {
  const {
    content,
    setContent,
    currentUser,
    collaborators,
    versions,
    setVersions,
    comments,
    setComments,
    loading,
    quillRef,
    handleChange,
    handleClear,
    hasChanges,
    updateInitialContent,
  } = useEditorData();

  const {
    showVersions,
    setShowVersions,
    handleSaveVersion: originalHandleSaveVersion,
    handleRestoreVersion: originalHandleRestoreVersion,
  } = useVersionManagement(content, setVersions, setContent, quillRef);

  // 包装保存版本函数，保存成功后更新初始内容
  const handleSaveVersion = async () => {
    const result = await originalHandleSaveVersion();
    // 保存成功后，将当前内容作为新的初始内容
    if (result) {
      updateInitialContent(content);
    }
  };

  // 包装恢复版本函数，恢复后更新初始内容
  const handleRestoreVersion = (version: any) => {
    originalHandleRestoreVersion(version);
    // 恢复后，将恢复的内容作为新的初始内容
    updateInitialContent(version.content);
  };

  const {
    isReviewMode,
    setIsReviewMode,
    reviews,
    handleAddReview,
    handleAddReviewComment,
    handleResolveReview,
  } = useReviewManagement(currentUser, quillRef);

  const {
    showComments,
    setShowComments,
    handleAddComment,
    handleReplyComment,
  } = useCommentManagement(currentUser, quillRef, comments, setComments);

  const { wordCount, charCount } = useWordCount(content, quillRef);

  if (loading) {
    return (
      <div className='editor-container'>
        <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>
      </div>
    );
  }

  return (
    <div className='editor-container'>
      <EditorToolbar
        onClear={handleClear}
        onSaveVersion={handleSaveVersion}
        showVersions={showVersions}
        onToggleVersions={() => setShowVersions(!showVersions)}
        isReviewMode={isReviewMode}
        onToggleReviewMode={() => setIsReviewMode(!isReviewMode)}
        showComments={showComments}
        onToggleComments={() => setShowComments(!showComments)}
        commentsCount={comments.length}
        onAddReview={handleAddReview}
        onAddComment={handleAddComment}
        hasChanges={hasChanges}
      />

      <div className='editor-main'>
        <EditorSidebar
          showComments={showComments}
          comments={comments}
          onReplyComment={handleReplyComment}
        />

        <EditorContent
          content={content}
          onChange={handleChange}
          quillRef={quillRef}
        />

        <VersionsPanel
          show={showVersions}
          versions={versions}
          onClose={() => setShowVersions(false)}
          onRestore={handleRestoreVersion}
        />
      </div>

      <EditorFooter
        wordCount={wordCount}
        charCount={charCount}
        currentUser={currentUser}
        collaborators={collaborators}
      />

      <ReviewsPanel
        reviews={reviews}
        onAddComment={handleAddReviewComment}
        onResolve={handleResolveReview}
      />
    </div>
  );
};

export default Editor;
