import React, { useState } from 'react';
import { Folder } from '../../features/folders/foldersSlice';
import { FaFolder, FaFolderOpen, FaChevronRight, FaChevronDown } from 'react-icons/fa';

interface FolderNodeProps {
  folder: Folder;
  level: number;
  selectedFolderId: number | null;
  onFolderSelect: (folder: Folder) => void;
  onFolderContextMenu: (event: React.MouseEvent, folder: Folder) => void;
}

const FolderNode: React.FC<FolderNodeProps> = ({
  folder,
  level,
  selectedFolderId,
  onFolderSelect,
  onFolderContextMenu
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubfolders = folder.subfolders && folder.subfolders.length > 0;
  const isSelected = selectedFolderId === folder.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onFolderSelect(folder);
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 ${
          isSelected ? 'bg-blue-100' : ''
        }`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleSelect}
        onContextMenu={(e) => onFolderContextMenu(e, folder)}
      >
        <span className="mr-1" onClick={handleToggle}>
          {hasSubfolders && (isExpanded ? <FaChevronDown /> : <FaChevronRight />)}
        </span>
        <span className="mr-2">
          {isExpanded ? <FaFolderOpen className="text-yellow-500" /> : <FaFolder className="text-yellow-500" />}
        </span>
        <span className="truncate">{folder.name}</span>
      </div>
      {isExpanded && hasSubfolders && (
        <div>
          {folder.subfolders.map((subfolder) => (
            <FolderNode
              key={subfolder.id}
              folder={subfolder}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              onFolderSelect={onFolderSelect}
              onFolderContextMenu={onFolderContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface FolderTreeProps {
  folders: Folder[];
  selectedFolderId: number | null;
  onFolderSelect: (folder: Folder) => void;
  onFolderContextMenu: (event: React.MouseEvent, folder: Folder) => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  selectedFolderId,
  onFolderSelect,
  onFolderContextMenu
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="font-semibold mb-2">Folders</div>
      {folders.length === 0 ? (
        <div className="text-gray-500 text-sm">No folders yet</div>
      ) : (
        folders.map((folder) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            level={0}
            selectedFolderId={selectedFolderId}
            onFolderSelect={onFolderSelect}
            onFolderContextMenu={onFolderContextMenu}
          />
        ))
      )}
    </div>
  );
};

export default FolderTree; 