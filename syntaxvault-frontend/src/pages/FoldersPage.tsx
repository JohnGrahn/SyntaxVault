import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchRootFolders,
  fetchFolders,
  deleteFolder,
  Folder,
  setCurrentFolder,
} from '../features/folders/foldersSlice';
import FolderTree from '../components/Folders/FolderTree';
import FolderForm from '../components/Folders/FolderForm';
import FolderContextMenu from '../components/Folders/FolderContextMenu';
import FolderBreadcrumb from '../components/Folders/FolderBreadcrumb';
import Modal from '../components/Layout/Modal';

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
    dispatch(fetchRootFolders());
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
    setSelectedFolder(folders.find((f: Folder) => f.id === parentId) || null);
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
                const folder = folders.find((f: Folder) => f.id === id);
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
          onClose={() => setShowCreateForm(false)}
          title="Create New Folder"
        >
          <FolderForm
            parentId={selectedFolder?.id}
            onClose={() => {
              setShowCreateForm(false);
            }}
          />
        </Modal>
      )}

      {/* Edit Folder Modal */}
      {showEditForm && selectedFolder && (
        <Modal 
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          title="Edit Folder"
        >
          <FolderForm
            folder={selectedFolder}
            onClose={() => {
              setShowEditForm(false);
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
  );
};

export default FoldersPage; 