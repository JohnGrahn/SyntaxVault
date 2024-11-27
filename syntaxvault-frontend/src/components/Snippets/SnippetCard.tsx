import React, { useEffect } from 'react';
import { Snippet } from '../../types/types';
import { Link } from 'react-router-dom';
import Prism from '../../utils/prism';
import { useDrag } from 'react-dnd';
import { DragTypes } from '../../constants/dragTypes';

interface SnippetCardProps {
  snippet: Snippet;
  isPublic?: boolean;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet, isPublic }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [snippet]);

  const [{ isDragging }, drag] = useDrag({
    type: DragTypes.SNIPPET,
    item: { 
      type: DragTypes.SNIPPET,
      id: snippet.id,
      folderId: snippet.folderId 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const codePreview =
    snippet.content.length > 100 ? `${snippet.content.slice(0, 100)}...` : snippet.content;

  const linkPath = isPublic 
    ? `/public-snippets/${snippet.id}`
    : `/dashboard/snippets/${snippet.id}`;

  return (
    <div 
      ref={drag}
      className={`border rounded-lg p-4 shadow hover:shadow-xl transition-shadow duration-300 flex flex-col ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <Link to={linkPath} className="text-xl font-semibold text-blue-500 hover:underline">
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
        <span>By: {snippet.username}</span>
        <span className="ml-4">Created: {new Date(snippet.creationDate).toLocaleString()}</span>
        <span className="ml-4">Modified: {new Date(snippet.lastModifiedDate).toLocaleString()}</span>
        {snippet.folderId && (
          <span className="ml-4">
            Folder: {snippet.folderName}
          </span>
        )}
      </div>
    </div>
  );
};

export default SnippetCard;
