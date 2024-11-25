// src/components/Snippets/SearchBar.tsx
import React, { useState, FormEvent } from 'react';
import { useAppDispatch } from '../../hooks';
import { fetchSnippets } from '../../features/snippets/snippetsSlice';
import { Tag } from '../../types/types';

const SearchBar: React.FC<{ selectedTags: Tag[] }> = ({ selectedTags }) => {
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Dispatch fetchSnippets with the current filters
    dispatch(fetchSnippets({
      keyword: keyword.trim() || undefined,
      language: language.trim() || undefined,
      tags: selectedTags.length > 0 ? selectedTags.map(tag => tag.name) : undefined,
    }));
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
