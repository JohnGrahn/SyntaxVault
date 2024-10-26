import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchPublicSnippets } from '../../features/snippets/snippetsSlice';
import Prism from '../../utils/prism';

const PublicSnippetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { publicSnippets, loading, error } = useAppSelector((state) => state.snippets);

  const snippet = publicSnippets.find((s) => s.id === Number(id));

  useEffect(() => {
    if (!publicSnippets.length) {
      dispatch(fetchPublicSnippets());
    }
  }, [dispatch, publicSnippets.length]);

  useEffect(() => {
    Prism.highlightAll();
  }, [snippet]);

  if (loading) return <p>Loading snippet...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!snippet) return <p>Snippet not found.</p>;

  return (
    <div className="p-4">
      <Link to="/public-snippets" className="text-blue-500 mb-4 inline-block">
        &larr; Back to Public Snippets
      </Link>
      <h2 className="text-3xl mb-2">{snippet.title}</h2>
      <p className="text-gray-600 mb-4">{snippet.description}</p>
      <div className="mb-4">
        <span className="text-sm text-gray-600">Shared by: {snippet.username}</span>
      </div>
      <pre>
        <code className={`language-${snippet.language}`}>{snippet.content}</code>
      </pre>
      <div className="mt-4">
        {snippet.tags.map((tag) => (
          <span key={tag.id} className="bg-gray-200 text-gray-700 px-2 py-1 mr-2 rounded">
            {tag.name}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <span className="text-sm text-gray-500">
          Created: {new Date(snippet.creationDate).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default PublicSnippetDetail;