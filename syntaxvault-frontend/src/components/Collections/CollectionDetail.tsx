import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchCollections } from '../../features/collections/collectionsSlice';
import { fetchSnippets } from '../../features/snippets/snippetsSlice';
import { useParams, Link } from 'react-router-dom';
import { Snippet } from '../../types/types';
import SnippetCard from '../Snippets/SnippetCard';

const CollectionDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { collections, loading: collectionsLoading, error: collectionsError } = useAppSelector((state) => state.collections);
  const { snippets, loading: snippetsLoading, error: snippetsError } = useAppSelector((state) => state.snippets);

  useEffect(() => {
    if (collections.length === 0) {
      dispatch(fetchCollections());
    }
    if (snippets.length === 0) {
      dispatch(fetchSnippets());
    }
  }, [dispatch, collections.length, snippets.length]);

  const collection = collections.find((col) => col.id === parseInt(id!));

  if (collectionsLoading || snippetsLoading) return <p>Loading...</p>;
  if (collectionsError) return <p className="text-red-500">{collectionsError}</p>;
  if (snippetsError) return <p className="text-red-500">{snippetsError}</p>;
  if (!collection) return <p>Collection not found.</p>;

  const associatedSnippets: Snippet[] = snippets.filter(snippet => collection.snippetIds.includes(snippet.id));

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">{collection.name}</h2>
      <Link to={`/dashboard/edit-collection/${collection.id}`} className="text-yellow-500 mb-4 inline-block">
        Edit Collection
      </Link>
      <h3 className="text-xl mt-4 mb-2">Snippets:</h3>
      {associatedSnippets.length === 0 ? (
        <p>No snippets in this collection.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {associatedSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionDetail;
