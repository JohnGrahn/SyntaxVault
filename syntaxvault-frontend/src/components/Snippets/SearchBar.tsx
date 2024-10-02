// src/components/Snippets/SearchBar.tsx
import React, { useState, FormEvent } from 'react';
import { useAppDispatch } from '../../hooks';
import { fetchSnippets } from '../../features/snippets/snippetsSlice';

const SearchBar: React.FC<{ selectedTags: string[] }> = ({ selectedTags }) => {
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Implement API call with filters
    // For demonstration, assuming fetchSnippets accepts query params
    dispatch(fetchSnippets()); // Modify this to include filters
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center mb-4">
      <input
        type="text"
        placeholder="Search snippets..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-1/3 px-3 py-2 border rounded mr-2"
      />
      <input
        type="text"
        placeholder="Language..."
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-1/3 px-3 py-2 border rounded mr-2"
      />
      <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
        Search
      </button>
    </form>
  );
};

export default SearchBar;