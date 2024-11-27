import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchFolders,
  deleteFolder,
  updateFolder,
  Folder,
  setCurrentFolder,
} from '../features/folders/foldersSlice';
import {
  fetchSnippetsByFolder,
  moveSnippetToFolder,
} from '../features/snippets/snippetsSlice';
import FolderTree from '../components/Folders/FolderTree';
import FolderForm from '../components/Folders/FolderForm';
import FolderContextMenu from '../components/Folders/FolderContextMenu';
import FolderBreadcrumb from '../components/Folders/FolderBreadcrumb';
import SnippetCard from '../components/Snippets/SnippetCard';
import Modal from '../components/Layout/Modal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DragTypes } from '../constants/dragTypes';

const FoldersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { rootFolders, folders, currentFolder, loading: foldersLoading, error: foldersError } = useAppSelector((state) => state.folders);
  const { snippets, loading: snippetsLoading, error: snippetsError } = useAppSelector((state) => state.snippets);
  
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

  useEffect(() => {
    if (currentFolder) {
      dispatch(fetchSnippetsByFolder(currentFolder.id));
    }
  }, [dispatch, currentFolder]);

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

  const handleFolderDrop = async (draggedId: number, targetId: number, type: string) => {
    if (type === DragTypes.FOLDER) {
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

        // Refresh folders after the move
        dispatch(fetchFolders());
      } catch (err) {
        console.error('Failed to move folder:', err);
      }
    } else if (type === DragTypes.SNIPPET) {
      try {
        await dispatch(moveSnippetToFolder({ snippetId: draggedId, folderId: targetId })).unwrap();
        if (currentFolder) {
          dispatch(fetchSnippetsByFolder(currentFolder.id));
        }
      } catch (err) {
        console.error('Failed to move snippet:', err);
      }
    }
  };

  const closeContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, folder: null });
  };

  if (foldersLoading && !folders.length) {
    return <div className="p-4">Loading folders...</div>;
  }

  if (foldersError) {
    return <div className="p-4 text-red-500">Error: {foldersError}</div>;
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
            onFolderDrop={(draggedId: number, targetId: number) => handleFolderDrop(draggedId, targetId, DragTypes.FOLDER)}
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
              {snippetsLoading ? (
                <div>Loading snippets...</div>
              ) : snippetsError ? (
                <div className="text-red-500">Error loading snippets: {snippetsError}</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {snippets.map((snippet) => (
                    <SnippetCard key={snippet.id} snippet={snippet} />
                  ))}
                  {snippets.length === 0 && (
                    <div className="text-gray-500">
                      No snippets in this folder. Drag and drop snippets here to add them.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {!currentFolder && (
            <div className="text-center text-gray-500 mt-8">
              Select a folder to view its snippets
            </div>
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
                setSelectedFolder(null);
              }}
            />
          </Modal>
        )}

        {/* Edit Folder Modal */}
        {showEditForm && selectedFolder && (
          <Modal 
            isOpen={showEditForm}
            onClose={() => setShowEditForm(false)}
            title={`Edit Folder: ${selectedFolder.name}`}
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