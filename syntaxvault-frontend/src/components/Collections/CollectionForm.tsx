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

  const [name, setName] = useState('');
  const [selectedSnippets, setSelectedSnippets] = useState<number[]>([]);

  useEffect(() => {
    if (isEditMode && collections.length === 0) {
      dispatch(fetchCollections());
    }
    if (snippets.length === 0) {
      dispatch(fetchSnippets());
    }
  }, [dispatch, isEditMode, collections.length, snippets.length]);

  useEffect(() => {
    if (isEditMode && collections.length > 0) {
      const collection = collections.find((col) => col.id === parseInt(id!));
      if (collection) {
        setName(collection.name);
        setSelectedSnippets(collection.snippetIds);
      }
    }
  }, [isEditMode, collections, id]);

  const handleSnippetSelection = (snippetId: number) => {
    setSelectedSnippets((prev) =>
      prev.includes(snippetId) ? prev.filter((id) => id !== snippetId) : [...prev, snippetId]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const collectionData: CollectionRequest = {
      name,
      snippetIds: selectedSnippets,
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={255}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Select Snippets</label>
          {snippets.length === 0 ? (
            <p>No snippets available to add.</p>
          ) : (
            <div className="mt-2 grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border p-2 rounded">
              {snippets.map((snippet) => (
                <label key={snippet.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSnippets.includes(snippet.id)}
                    onChange={() => handleSnippetSelection(snippet.id)}
                    className="mr-2"
                  />
                  {snippet.title}
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
