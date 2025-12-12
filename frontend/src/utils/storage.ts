const STORAGE_KEY = 'collaborative-editor-doc';

export const storage = {
  save(content: string): void {
    try {
      localStorage.setItem(STORAGE_KEY, content);
    } catch (error) {
      console.error('保存到本地存储失败:', error);
    }
  },

  load(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.error('从本地存储加载失败:', error);
      return null;
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('清空本地存储失败:', error);
    }
  },
};

