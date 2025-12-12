import React from 'react';
import { Version } from '../types';

interface VersionsPanelProps {
  show: boolean;
  versions: Version[];
  onClose: () => void;
  onRestore: (version: Version) => void;
}

export const VersionsPanel: React.FC<VersionsPanelProps> = ({
                                                              show,
                                                              versions,
                                                              onClose,
                                                              onRestore,
                                                            }) => {
  if (!show) return null;

  return (
    <div className='versions-panel'>
      <div className='panel-header'>
        <h3>版本历史</h3>
        <button onClick={onClose} className='close-btn'>×</button>
      </div>
      <div className='versions-list'>
        {versions.length === 0 ? (
          <p className='empty-state'>暂无版本历史</p>
        ) : (
          versions.slice().reverse().map(version => (
            <div key={version.id} className='version-item'>
              <div className='version-info'>
                <span className='version-author'>{version.author}</span>
                <span className='version-time'>
                  {new Date(version.timestamp).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => onRestore(version)}
                className='btn btn-small'
              >
                恢复
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
