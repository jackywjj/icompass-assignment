import { useCallback, useEffect, useRef, useState } from 'react';
import { userManager } from '../utils/user';
import { storage } from '../utils/storage';
import { collaborationService } from '../utils/collaboration';
import { api } from '../apis';
import { Comment, User, Version } from '../types';

export const useEditorData = () => {
  const [content, setContent] = useState<string>('');
  const [initialContent, setInitialContent] = useState<string>(''); // 初始内容（从服务器加载的）
  const [currentUser] = useState(userManager.getCurrentUser());
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const quillRef = useRef<any>(null);
  
  // 检查内容是否有更改（去除空白字符后比较）
  const hasChanges = content.trim() !== initialContent.trim();

  // 初始化 - 从后端加载当前文章
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 从后端获取当前文章
        const article = await api.getCurrentArticle();
        if (article && typeof article === 'object' && 'content' in article &&
          typeof article.content === 'string') {
          const articleContent = article.content;
          setContent(articleContent);
          setInitialContent(articleContent); // 保存初始内容
          // 同时保存到 localStorage 作为本地备份
          storage.save(articleContent);
        } else {
          // 如果后端没有内容，尝试从 localStorage 加载
          const savedContent = storage.load() || '';
          setContent(savedContent);
          setInitialContent(savedContent); // 保存初始内容
          if (!savedContent) {
          storage.clear();
          }
        }

        // 从后端加载版本历史（所有 articles，按 id 倒序）
        const backendArticles = await api.getAllArticles();
        setVersions(backendArticles.map((a: any) => ({
          id: a.id,
          timestamp: a.timestamp,
          content: a.content,
          author: a.author,
        })));

        // 从后端加载批注
        const backendComments = await api.getComments();
        setComments(backendComments.map((c: any) => ({
          id: String(c.id),
          text: c.text,
          targetText: c.target_text,
          startIndex: c.start_index,
          endIndex: c.end_index,
          author: c.author,
          timestamp: c.timestamp,
          replies: [], // 后端暂不支持回复，保留空数组
        })));
      } catch (error) {
        console.error('加载数据失败:', error);
        // 如果后端请求失败，尝试从 localStorage 加载
        const savedContent = storage.load() || '';
          setContent(savedContent);
        setInitialContent(savedContent); // 保存初始内容
        if (!savedContent) {
          storage.clear();
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // 连接协同服务
    collaborationService.connect(currentUser);

    // 监听协同事件
    collaborationService.on('user-joined', (user: User) => {
      setCollaborators(prev => {
        if (!prev.find(u => u.id === user.id)) {
          return [...prev, user];
        }
        return prev;
      });
    });

    collaborationService.on('user-left', (userId: string) => {
      setCollaborators(prev => prev.filter(u => u.id !== userId));
    });

    collaborationService.on('cursor-update', ({ userId, cursor }: { userId: string; cursor: any }) => {
      setCollaborators(prev => prev.map(u =>
        u.id === userId ? { ...u, cursor } : u,
      ));
    });

    collaborationService.on('content-update', () => {
      // 在实际项目中，这里应该使用 Yjs 等协同编辑库
      // 这里只是演示
    });

    return () => {
      collaborationService.disconnect();
    };
  }, []);

  // 内容变化处理 - 只保存到 localStorage，不提交到后端
  const handleChange = useCallback((value: string) => {
    setContent(value);
    // 保存到 localStorage（未提交的内容）
    storage.save(value);

    // 更新光标位置
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const selection = editor.getSelection();
      if (selection) {
        collaborationService.updateCursor(currentUser.id, {
          index: selection.index,
          length: selection.length,
        });
      }
    }
  }, [currentUser.id]);

  // 清空内容
  const handleClear = () => {
    if (window.confirm('确定要清空所有内容吗？')) {
      setContent('');
      setInitialContent(''); // 同时更新初始内容
      storage.clear();
      if (quillRef.current) {
        quillRef.current.getEditor().setText('');
      }
    }
  };

  // 更新初始内容的函数（用于保存版本后重置）
  const updateInitialContent = useCallback((newInitialContent: string) => {
    setInitialContent(newInitialContent);
  }, []);

  return {
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
    hasChanges, // 导出是否有更改的状态
    updateInitialContent, // 导出更新初始内容的函数
  };
};
