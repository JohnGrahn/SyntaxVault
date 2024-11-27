import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchPublicSnippets } from '../../features/snippets/snippetsSlice';
import SnippetCard from './SnippetCard';
import { Snippet } from '../../types/types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const PublicSnippets: React.FC = () => {
  const dispatch = useAppDispatch();
  const { publicSnippets, loading, error } = useAppSelector((state) => state.snippets);

  useEffect(() => {
    dispatch(fetchPublicSnippets());
  }, [dispatch]);

  if (loading) return <p>Loading public snippets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <h2 className="text-2xl mb-4">Public Snippets</h2>
        <div className="grid grid-cols-1 gap-4">
          {publicSnippets.map((snippet: Snippet) => (
            <SnippetCard 
              key={snippet.id} 
              snippet={snippet} 
              isPublic={true}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default PublicSnippets;
