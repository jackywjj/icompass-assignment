import React from 'react';
import { User } from '../types';

interface EditorFooterProps {
  wordCount: number;
  charCount: number;
  currentUser: User;
  collaborators: User[];
}

export const EditorFooter: React.FC<EditorFooterProps> = ({
                                                            wordCount,
                                                            charCount,
                                                            currentUser,
                                                            collaborators,
                                                          }) => {
  return (
    <div className='editor-footer'>
      <div className='status-left'>
        <span>字数: {wordCount} 字</span>
        <span>字符: {charCount} 字符</span>
      </div>
      <div className='status-right'>
        <span>当前用户: {currentUser.name}</span>
        {collaborators.length > 0 && (
          <div className='collaborators'>
            <span>协作者: </span>
            {collaborators.map(user => (
              <span
                key={user.id}
                className='collaborator-badge'
                style={{ backgroundColor: user.color }}
              >
                {user.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
