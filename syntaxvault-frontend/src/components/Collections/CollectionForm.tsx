import React, { useState, useEffect, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addCollection, updateCollection, fetchCollections } from '../../features/collections/collectionsSlice';
import { fetchSnippets } from '../../features/snippets/snippetsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Collection, CollectionRequest, Snippet } from '../../types/types';

const CollectionForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { collections, loading, error } = useAppSelector((state) => state.collections);
  const { snippets } = useAppSelector((state) => state.snippets);

  const [formData, setFormData] = useState<{
    name: string;
    snippetIds: number[];
    isPublic: boolean;
  }>({
    name: '',
    snippetIds: [],
    isPublic: false,
  });

  useEffect(() => {
    if (isEditMode && collections.length === 0) {
      dispatch(fetchCollections());
    }
    if (snippets.length === 0) {
      dispatch(fetchSnippets({}));
    }
  }, [dispatch, isEditMode, collections.length, snippets.length]);

  useEffect(() => {
    if (isEditMode && collections.length > 0) {
      const collection = collections.find((col) => col.id === parseInt(id!));
      if (collection) {
        setFormData({
          name: collection.name || '',
          snippetIds: collection.snippetIds || [],
          isPublic: Boolean(collection.isPublic),
        });
      }
    }
  }, [isEditMode, collections, id]);

  const handleSnippetSelection = (snippetId: number) => {
    setFormData(prev => ({
      ...prev,
      snippetIds: prev.snippetIds.includes(snippetId) 
        ? prev.snippetIds.filter((id) => id !== snippetId) 
        : [...prev.snippetIds, snippetId]
    }));
  };

  const handlePublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setFormData(prev => ({
      ...prev,
      isPublic: newValue,
      snippetIds: newValue 
        ? prev.snippetIds.filter(id => snippets.find(s => s.id === id)?.isPublic)
        : prev.snippetIds
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const collectionData: CollectionRequest = {
      name: formData.name,
      snippetIds: formData.snippetIds,
      isPublic: formData.isPublic,
    };

    if (isEditMode) {
      dispatch(updateCollection({ id: parseInt(id!), collectionData }))
        .unwrap()
        .then(() => navigate('/dashboard/collections'))
        .catch((err) => console.error(err));
    } else {
      dispatch(addCollection(collectionData))
        .unwrap()
        .then(() => navigate('/dashboard/collections'))
        .catch((err) => console.error(err));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">{isEditMode ? 'Edit Collection' : 'Add New Collection'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Collection Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            maxLength={255}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={handlePublicChange}
              className="mr-2"
            />
            <span className="text-gray-700">Make Collection Public</span>
          </label>
          {formData.isPublic && (
            <p className="text-sm text-gray-500 mt-1">
              Note: Only public snippets can be included in public collections
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-gray-700">Select Snippets</label>
          {snippets.length === 0 ? (
            <p>No snippets available to add.</p>
          ) : (
            <div className="mt-2 grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border p-2 rounded">
              {snippets
                .filter(snippet => !formData.isPublic || snippet.isPublic)
                .map((snippet) => (
                  <label key={snippet.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.snippetIds.includes(snippet.id)}
                      onChange={() => handleSnippetSelection(snippet.id)}
                      className="mr-2"
                    />
                    {snippet.title}
                    {formData.isPublic && !snippet.isPublic && (
                      <span className="text-red-500 ml-2">(Not available - private snippet)</span>
                    )}
                  </label>
                ))}
            </div>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isEditMode ? 'Update Collection' : 'Create Collection'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollectionForm;
