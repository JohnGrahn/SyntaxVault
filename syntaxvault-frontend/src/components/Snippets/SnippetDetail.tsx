// src/components/Snippets/SnippetDetail.tsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchSnippets } from '../../features/snippets/snippetsSlice';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

const SnippetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { snippets, loading, error } = useAppSelector((state) => state.snippets);

  const snippet = snippets.find((s) => s.id === Number(id));

  useEffect(() => {
    if (!snippets.length) {
      dispatch(fetchSnippets());
    }
  }, [dispatch, snippets.length]);

  useEffect(() => {
    Prism.highlightAll();
  }, [snippet]);

  if (loading) return <p>Loading snippet...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!snippet) return <p>Snippet not found.</p>;

  return (
    <div className="p-4">
      <Link to="/dashboard" className="text-blue-500 mb-4 inline-block">
        &larr; Back to Snippets
      </Link>
      <h2 className="text-3xl mb-2">{snippet.title}</h2>
      <p className="text-gray-600 mb-4">{snippet.description}</p>
      <pre>
        <code className={`language-${snippet.language}`}>{snippet.content}</code>
      </pre>
      <div className="mt-4">
        {snippet.tags.map((tag) => (
          <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 mr-2 rounded">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <span className="text-sm text-gray-500">
          Created At: {new Date(snippet.createdAt).toLocaleString()}
        </span>
        <span className="text-sm text-gray-500 ml-4">
          Last Modified: {new Date(snippet.updatedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default SnippetDetail;