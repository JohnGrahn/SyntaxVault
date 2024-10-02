// src/pages/AddSnippet.tsx
import React, { useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addSnippet } from '../features/snippets/snippetsSlice';
import { useNavigate } from 'react-router-dom';

const AddSnippet: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.snippets);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('');
  const [tags, setTags] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const snippetData = {
      title,
      description,
      content,
      language,
      tags: tags.split(',').map(tag => tag.trim()),
    };

    try {
      await dispatch(addSnippet(snippetData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to add snippet:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Snippet</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700">Content</label>
          <textarea
            className="w-full border rounded px-3 py-2 h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700">Language</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Tags (comma separated)</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Snippet'}
        </button>
      </form>
    </div>
  );
};

export default AddSnippet;