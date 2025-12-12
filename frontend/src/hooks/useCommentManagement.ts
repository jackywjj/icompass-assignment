import type { RefObject } from 'react';
import { useState } from 'react';
import { api } from '../apis';
import { Comment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useCommentManagement = (
  currentUser: { name: string },
  quillRef: RefObject<any>,
  _comments: Comment[],
  setComments: (comments: Comment[] | ((prev: Comment[]) => Comment[])) => void,
) => {
  const [showComments, setShowComments] = useState(false);

  // 添加批注 - 提交到后端
  const handleAddComment = async () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const selection = editor.getSelection();
    if (!selection || selection.length === 0) {
      alert('请先选择要批注的文本');
      return;
    }

    const targetText = editor.getText(selection.index, selection.length);
    const commentText = window.prompt('请输入批注内容：');
    if (!commentText) return;

    try {
      const comment = await api.saveComment({
        text: commentText,
        target_text: targetText,
        start_index: selection.index,
        end_index: selection.index + selection.length,
      });

      if (comment) {
        // 添加到本地批注列表
        setComments(prev => [{
          id: String(comment.id),
          text: comment.text,
          targetText: comment.target_text,
          startIndex: comment.start_index,
          endIndex: comment.end_index,
          author: comment.author,
          timestamp: comment.timestamp,
          replies: [],
        }, ...prev]);
      }
    } catch (error) {
      console.error('保存批注失败:', error);
      alert('保存批注失败，请重试');
    }
  };

  // 回复批注（本地功能，暂不提交到后端）
  const handleReplyComment = (commentId: string) => {
    const replyText = window.prompt('请输入回复内容：');
    if (!replyText) return;

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: uuidv4(),
              text: replyText,
              author: currentUser.name,
              timestamp: Date.now(),
            },
          ],
        };
      }
      return comment;
    }));
  };

  return {
    showComments,
    setShowComments,
    handleAddComment,
    handleReplyComment,
  };
};
