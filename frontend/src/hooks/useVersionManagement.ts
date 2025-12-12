import type { RefObject } from 'react';
import { useState } from 'react';
import { api } from '../apis';
import { Version } from '../types';
import { storage } from '../utils/storage.ts';

export const useVersionManagement = (
  content: string,
  setVersions: (versions: Version[]) => void,
  setContent: (content: string) => void,
  quillRef: RefObject<any>,
) => {
  const [showVersions, setShowVersions] = useState(false);

  // 保存版本 - 保存 article 
  const handleSaveVersion = async () => {
    try {
      const article = await api.saveArticle(content);
      if (article) {
        // 重新获取所有文章作为版本历史
        const allArticles = await api.getAllArticles();
        setVersions(allArticles.map((a: any) => ({
          id: a.id,
          timestamp: a.timestamp,
          content: a.content,
          author: a.author,
        })));
        alert('版本已保存');
      }
    } catch (error) {
      console.error('保存版本失败:', error);
      alert('保存版本失败，请重试');
    }
  };

  // 恢复版本
  const handleRestoreVersion = (version: Version) => {
    if (window.confirm('确定要恢复此版本吗？当前内容将被替换。')) {
      setContent(version.content);
      if (quillRef.current) {
        const delta = quillRef.current.getEditor().clipboard.convert(version.content);
        quillRef.current.getEditor().setContents(delta, 'api');
      }
      storage.save(version.content); // 使用已导入的 storage
    }
  };

  return {
    showVersions,
    setShowVersions,
    handleSaveVersion,
    handleRestoreVersion,
  };
};
