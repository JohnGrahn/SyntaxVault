import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchFolders,
  deleteFolder,
  updateFolder,
  Folder,
  setCurrentFolder,
} from '../features/folders/foldersSlice';
import FolderTree from '../components/Folders/FolderTree';
import FolderForm from '../components/Folders/FolderForm';
import FolderContextMenu from '../components/Folders/FolderContextMenu';
import FolderBreadcrumb from '../components/Folders/FolderBreadcrumb';
import Modal from '../components/Layout/Modal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const FoldersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { rootFolders, folders, currentFolder, loading, error } = useAppSelector((state) => state.folders);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    folder: Folder | null;
  }>({
    show: false,
    x: 0,
    y: 0,
    folder: null,
  });

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  const handleFolderSelect = (folder: Folder) => {
    dispatch(setCurrentFolder(folder));
  };

  const handleFolderContextMenu = (event: React.MouseEvent, folder: Folder) => {
    event.preventDefault();
    setContextMenu({
      show: true,
      x: event.clientX,
      y: event.clientY,
      folder,
    });
  };

  const handleCreateSubfolder = (parentId: number) => {
    setSelectedFolder(folders.find(f => f.id === parentId) || null);
    setShowCreateForm(true);
  };

  const handleEditFolder = (folder: Folder) => {
    setSelectedFolder(folder);
    setShowEditForm(true);
  };

  const handleDeleteFolder = async (folder: Folder) => {
    if (window.confirm(`Are you sure you want to delete the folder "${folder.name}"?`)) {
      try {
        await dispatch(deleteFolder(folder.id)).unwrap();
        if (currentFolder?.id === folder.id) {
          dispatch(setCurrentFolder(null));
        }
      } catch (err) {
        console.error('Failed to delete folder:', err);
      }
    }
  };

  const handleFolderDrop = async (draggedId: number, targetId: number) => {
    const draggedFolder = folders.find(f => f.id === draggedId);
    const targetFolder = folders.find(f => f.id === targetId);

    if (!draggedFolder || !targetFolder) return;

    // Prevent dropping a folder into itself or its children
    if (draggedFolder.path === targetFolder.path || targetFolder.path.startsWith(draggedFolder.path + '/')) {
      return;
    }

    try {
      await dispatch(updateFolder({
        id: draggedId,
        folderData: {
          name: draggedFolder.name,
          parentId: targetId
        }
      })).unwrap();

      // Refresh folders and update the view
      await dispatch(fetchFolders()).unwrap();
      dispatch(setCurrentFolder(targetFolder));
    } catch (err) {
      console.error('Failed to move folder:', err);
    }
  };

  const closeContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, folder: null });
  };

  if (loading && !folders.length) {
    return <div className="p-4">Loading folders...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full">
        {/* Folder Tree Sidebar */}
        <div className="w-64 border-r p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Folders</h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              New
            </button>
          </div>
          <FolderTree
            folders={rootFolders}
            selectedFolderId={currentFolder?.id || null}
            onFolderSelect={handleFolderSelect}
            onFolderContextMenu={handleFolderContextMenu}
            onFolderDrop={handleFolderDrop}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {currentFolder && (
            <>
              <FolderBreadcrumb
                path={currentFolder.path}
                folders={folders}
                onFolderClick={(id) => {
                  const folder = folders.find(f => f.id === id);
                  if (folder) handleFolderSelect(folder);
                }}
              />
              {/* Add your snippet list or other content here */}
            </>
          )}
        </div>

        {/* Create Folder Modal */}
        {showCreateForm && (
          <Modal 
            isOpen={showCreateForm}
            title="Create New Folder"
            onClose={() => setShowCreateForm(false)}
          >
            <FolderForm
              parentId={selectedFolder?.id}
              onClose={() => {
                setShowCreateForm(false);
                setSelectedFolder(null);
              }}
            />
          </Modal>
        )}

        {/* Edit Folder Modal */}
        {showEditForm && selectedFolder && (
          <Modal 
            isOpen={showEditForm}
            title="Edit Folder"
            onClose={() => setShowEditForm(false)}
          >
            <FolderForm
              folder={selectedFolder}
              onClose={() => {
                setShowEditForm(false);
                setSelectedFolder(null);
              }}
            />
          </Modal>
        )}

        {/* Context Menu */}
        {contextMenu.show && contextMenu.folder && (
          <FolderContextMenu
            folder={contextMenu.folder}
            position={{ x: contextMenu.x, y: contextMenu.y }}
            onClose={closeContextMenu}
            onEdit={handleEditFolder}
            onDelete={handleDeleteFolder}
            onCreateSubfolder={handleCreateSubfolder}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default FoldersPage; 