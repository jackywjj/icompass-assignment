import type { RefObject } from 'react';
import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// 扩展 Quill 以支持自定义格式
const Block = Quill.import('blots/block');
Block.tagName = 'div';
Quill.register(Block, true);

interface EditorContentProps {
  content: string;
  onChange: (value: string) => void;
  quillRef: RefObject<ReactQuill>;
}

export const EditorContent: React.FC<EditorContentProps> = ({
                                                              content,
                                                              onChange,
                                                              quillRef,
                                                            }) => {
  // Quill 模块配置
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'size', 'list', 'bullet',
    'align', 'link', 'image',
  ];

  return (
    <div className='editor-content'>
      <ReactQuill
        ref={quillRef}
        theme='snow'
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder='开始输入...'
        readOnly={false}
      />
    </div>
  );
};
