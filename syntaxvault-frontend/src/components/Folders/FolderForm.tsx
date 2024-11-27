import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createFolder, updateFolder, Folder, FolderRequest, fetchFolders } from '../../features/folders/foldersSlice';

interface FolderFormProps {
  folder?: Folder;
  parentId?: number | null;
  onClose: () => void;
}

const FolderForm: React.FC<FolderFormProps> = ({ folder, parentId, onClose }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(folder?.name || '');
  const [error, setError] = useState<string | null>(null);
  const { loading } = useAppSelector((state) => state.folders);

  useEffect(() => {
    if (folder) {
      setName(folder.name);
    }
  }, [folder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }

    try {
      if (folder) {
        await dispatch(updateFolder({
          id: folder.id,
          folderData: { 
            name, 
            parentId: folder.parentId === null ? undefined : folder.parentId 
          }
        })).unwrap();
      } else {
        const folderRequest: FolderRequest = { 
          name, 
          parentId: parentId === null ? undefined : parentId 
        };
        await dispatch(createFolder(folderRequest)).unwrap();
        await dispatch(fetchFolders());
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl mb-4">{folder ? 'Edit Folder' : 'Create New Folder'}</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Folder Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter folder name"
            disabled={loading}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : folder ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FolderForm; 