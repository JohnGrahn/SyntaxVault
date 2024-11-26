import React from 'react';
import { Folder } from '../../features/folders/foldersSlice';

interface Position {
  x: number;
  y: number;
}

interface FolderContextMenuProps {
  folder: Folder;
  position: Position;
  onClose: () => void;
  onEdit: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
  onCreateSubfolder: (parentId: number) => void;
}

const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
  folder,
  position,
  onClose,
  onEdit,
  onDelete,
  onCreateSubfolder,
}) => {
  const handleClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        className="absolute z-50 bg-white rounded-lg shadow-lg py-2 min-w-[160px]"
        style={{ top: position.y, left: position.x }}
      >
        <button
          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
          onClick={() => handleClick(() => onEdit(folder))}
        >
          Edit
        </button>
        <button
          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
          onClick={() => handleClick(() => onCreateSubfolder(folder.id))}
        >
          New Subfolder
        </button>
        <button
          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 text-sm"
          onClick={() => handleClick(() => onDelete(folder))}
        >
          Delete
        </button>
      </div>
    </>
  );
};

export default FolderContextMenu; 