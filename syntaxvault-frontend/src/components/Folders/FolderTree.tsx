import React, { useState, useEffect } from 'react';
import { Folder } from '../../features/folders/foldersSlice';
import { FaFolder, FaFolderOpen, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useDrag, useDrop } from 'react-dnd';
import { DragTypes } from '../../constants/dragTypes';

interface DragItem {
  type: string;
  id: number;
  parentId: number | null;
}

interface FolderNodeProps {
  folder: Folder;
  level: number;
  selectedFolderId: number | null;
  onFolderSelect: (folder: Folder) => void;
  onFolderContextMenu: (event: React.MouseEvent, folder: Folder) => void;
  onFolderDrop: (draggedId: number, targetId: number) => void;
}

const FolderNode: React.FC<FolderNodeProps> = ({
  folder,
  level,
  selectedFolderId,
  onFolderSelect,
  onFolderContextMenu,
  onFolderDrop
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubfolders = folder.subfolders && folder.subfolders.length > 0;
  const isSelected = selectedFolderId === folder.id;

  // Expand the folder when it becomes selected or when it has new subfolders
  useEffect(() => {
    if (isSelected || (hasSubfolders && folder.subfolders.length > 0)) {
      setIsExpanded(true);
    }
  }, [isSelected, hasSubfolders, folder.subfolders, folder.id]);

  // Set up drag
  const [{ isDragging }, drag] = useDrag({
    type: DragTypes.FOLDER,
    item: { 
      type: DragTypes.FOLDER,
      id: folder.id,
      parentId: folder.parentId 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Set up drop
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [DragTypes.FOLDER, DragTypes.SNIPPET],
    canDrop: (item: DragItem) => {
      // Prevent dropping on itself or its children
      if (item.type === DragTypes.FOLDER) {
        return item.id !== folder.id && !isChildFolder(folder, item.id);
      }
      return true;
    },
    drop: (item: DragItem) => {
      onFolderDrop(item.id, folder.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Helper function to check if a folder is a child of another folder
  const isChildFolder = (parentFolder: Folder, childId: number): boolean => {
    if (!parentFolder.subfolders) return false;
    return parentFolder.subfolders.some(
      subfolder => subfolder.id === childId || isChildFolder(subfolder, childId)
    );
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onFolderSelect(folder);
  };

  // Combine drag and drop refs
  const dragDropRef = (el: HTMLDivElement) => {
    drag(el);
    drop(el);
  };

  // Determine folder appearance based on drag and drop state
  const getFolderStyle = () => {
    if (isOver && canDrop) {
      return 'bg-blue-100';
    }
    if (isOver && !canDrop) {
      return 'bg-red-100';
    }
    if (isSelected) {
      return 'bg-blue-50';
    }
    return '';
  };

  return (
    <div 
      className={`select-none ${isDragging ? 'opacity-50' : ''}`}
      ref={dragDropRef}
    >
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 ${getFolderStyle()}`}
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
              onFolderDrop={onFolderDrop}
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
  onFolderDrop: (draggedId: number, targetId: number) => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  selectedFolderId,
  onFolderSelect,
  onFolderContextMenu,
  onFolderDrop
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
            onFolderDrop={onFolderDrop}
          />
        ))
      )}
    </div>
  );
};

export default FolderTree; 