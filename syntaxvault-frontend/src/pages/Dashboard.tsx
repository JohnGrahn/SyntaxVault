import React from 'react';
import SearchBar from '../components/Snippets/SearchBar';
import SnippetList from '../components/Snippets/SnippetList';
import SearchableTagSelect from '../components/Tags/SearchableTagSelect';
import { useAppDispatch } from '../hooks';
import { fetchSnippets } from '../features/snippets/snippetsSlice';
import { Tag } from '../types/types';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);

  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      dispatch(fetchSnippets({ tags: newTags.map(t => t.name) }));
    }
  };

  const handleTagDeselect = (tagId: number) => {
    const newTags = selectedTags.filter(t => t.id !== tagId);
    setSelectedTags(newTags);
    dispatch(fetchSnippets({ tags: newTags.map(t => t.name) }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <SearchBar selectedTags={selectedTags} />
      <div className="mb-4">
        <SearchableTagSelect
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onTagDeselect={handleTagDeselect}
        />
      </div>
      <SnippetList />
    </div>
  );
};

export default Dashboard;
