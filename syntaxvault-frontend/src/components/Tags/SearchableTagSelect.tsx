// src/components/Tags/SearchableTagSelect.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { searchTags } from '../../features/tags/tagsSlice';
import { Tag } from '../../types/types';

interface SearchableTagSelectProps {
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
  onTagDeselect: (tagId: number) => void;
}

const SearchableTagSelect: React.FC<SearchableTagSelectProps> = ({
  selectedTags,
  onTagSelect,
  onTagDeselect,
}) => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { tags, loading } = useAppSelector((state) => state.tags);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      dispatch(searchTags(searchQuery));
    }
  }, [searchQuery, dispatch]);

  const handleBlur = (e: React.FocusEvent) => {
    // Check if the related target is within the dropdown
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      // Only close if we're not clicking inside the dropdown
      setTimeout(() => setIsOpen(false), 200);
    }
  };

  return (
    <div className="relative" onBlur={handleBlur}>
      <div className="flex flex-wrap gap-2 p-2 border rounded mb-2">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center"
          >
            {tag.name}
            <button
              onClick={() => onTagDeselect(tag.id)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search tags (min 2 characters)..."
          className="w-full px-3 py-2 border rounded"
          tabIndex={0}
        />
        
        {isOpen && (
          <div 
            className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto"
            tabIndex={-1}
          >
            {loading ? (
              <div className="p-2">Loading...</div>
            ) : searchQuery.length < 2 ? (
              <div className="p-2 text-gray-500">Type at least 2 characters to search</div>
            ) : tags.length === 0 ? (
              <div className="p-2 text-gray-500">No tags found</div>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => {
                    onTagSelect(tag);
                    setSearchQuery('');
                    setIsOpen(false);
                  }}
                  tabIndex={0}
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.some((t) => t.id === tag.id)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  {tag.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableTagSelect;