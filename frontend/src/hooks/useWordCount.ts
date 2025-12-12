import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

export const useWordCount = (content: string, quillRef: RefObject<any>) => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // 更新字数统计
  useEffect(() => {
    const text = quillRef.current?.getEditor().getText() || '';
    const words = text.trim().split(/\s+/).filter((w: string | any[]) => w.length > 0);
    setWordCount(words.length);
    setCharCount(text.length);
  }, [content, quillRef]);

  return { wordCount, charCount };
};
