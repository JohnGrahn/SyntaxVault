// src/components/Tags/TagList.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchTags } from '../../features/tags/tagsSlice';

const TagList: React.FC<{ selectedTags: string[]; setSelectedTags: (tags: string[]) => void }> = ({
  selectedTags,
  setSelectedTags,
}) => {
  const dispatch = useAppDispatch();
  const { tags, loading, error } = useAppSelector((state) => state.tags);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (loading) return <p>Loading tags...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-wrap">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => toggleTag(tag.name)}
          className={`m-1 px-3 py-1 rounded ${
            selectedTags.includes(tag.name) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default TagList;