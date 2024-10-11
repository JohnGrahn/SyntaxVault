// src/components/Snippets/SnippetList.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchSnippets, deleteSnippet } from '../../features/snippets/snippetsSlice';
import { Link } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import { Snippet, Tag } from '../../types/types';

const SnippetList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { snippets: stateSnippets, loading, error } = useAppSelector((state) => state.snippets);

  useEffect(() => {
    dispatch(fetchSnippets());
  }, [dispatch]);

  useEffect(() => {
    Prism.highlightAll();
  }, [stateSnippets]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      dispatch(deleteSnippet(id));
    }
  };

  if (loading) return <p>Loading snippets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Your Snippets</h2>
        <Link to="/dashboard/add-snippet" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Snippet
        </Link>
      </div>
      {stateSnippets.length === 0 ? (
        <p>No snippets available. Add some!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {stateSnippets.map((snippet) => (
            <div key={snippet.id} className="border rounded p-4 shadow">
              <div className="flex justify-between items-center">
                <h3 className="text-xl">{snippet.title}</h3>
                <div>
                  <Link to={`/dashboard/snippets/${snippet.id}`} className="text-blue-500 mr-2">
                    View
                  </Link>
                  <Link to={`/dashboard/edit-snippet/${snippet.id}`} className="text-yellow-500 mr-2">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(snippet.id)} className="text-red-500">
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{snippet.description}</p>
              <pre className="mt-2">
                <code className={`language-${snippet.language}`}>{snippet.content}</code>
              </pre>
              <div className="mt-2">
                {snippet.tags.map((tag) => (
                  <span key={tag.id} className="bg-gray-200 text-gray-700 px-2 py-1 mr-2 rounded">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SnippetList;