import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchPublicCollections } from '../../features/collections/collectionsSlice';
import { fetchPublicSnippets } from '../../features/snippets/snippetsSlice';
import SnippetCard from '../Snippets/SnippetCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const PublicCollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { publicCollections, loading, error } = useAppSelector((state) => state.collections);
  const { publicSnippets } = useAppSelector((state) => state.snippets);

  const collection = publicCollections.find((c) => c.id === Number(id));
  const collectionSnippets = publicSnippets.filter((s) => collection?.snippetIds.includes(s.id));

  useEffect(() => {
    if (!publicCollections.length) {
      dispatch(fetchPublicCollections());
    }
    if (!publicSnippets.length) {
      dispatch(fetchPublicSnippets());
    }
  }, [dispatch, publicCollections.length, publicSnippets.length]);

  if (loading) return <p>Loading collection...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!collection) return <p>Collection not found.</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <Link to="/public-collections" className="text-blue-500 mb-4 inline-block">
          &larr; Back to Public Collections
        </Link>
        <h2 className="text-3xl mb-2">{collection.name}</h2>
        <p className="text-gray-600 mb-4">By: {collection.username}</p>
        
        <div className="mt-4">
          <h3 className="text-xl mb-2">Snippets in this Collection</h3>
          <div className="grid grid-cols-1 gap-4">
            {collectionSnippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} isPublic={true} />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default PublicCollectionDetail; 