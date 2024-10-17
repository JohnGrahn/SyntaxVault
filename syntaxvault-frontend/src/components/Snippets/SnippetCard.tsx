import React, { useEffect } from 'react';
import { Snippet } from '../../types/types';
import { Link } from 'react-router-dom';
import Prism from '../../utils/prism';

interface SnippetCardProps {
  snippet: Snippet;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [snippet]);

  const codePreview =
    snippet.content.length > 100 ? `${snippet.content.slice(0, 100)}...` : snippet.content;

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <Link to={`/dashboard/snippets/${snippet.id}`} className="text-xl font-semibold text-blue-500 hover:underline">
        {snippet.title}
      </Link>
      <p className="text-gray-600 mt-2">{snippet.description}</p>
      <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto flex-grow">
        <code className={`language-${snippet.language}`}>{codePreview}</code>
      </pre>
      <div className="mt-2">
        {snippet.tags.map((tag) => (
          <span key={tag.id} className="inline-block bg-gray-200 text-gray-700 px-2 py-1 mr-2 rounded text-sm">
            {tag.name}
          </span>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <span>Created At: {new Date(snippet.creationDate).toLocaleString()}</span>
        <span className="ml-4">Last Modified: {new Date(snippet.lastModifiedDate).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default SnippetCard;