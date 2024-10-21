import React, { useState } from 'react';
import SearchBar from '../components/Snippets/SearchBar';
import TagList from '../components/Tags/TagList';
import SnippetList from '../components/Snippets/SnippetList';

const Dashboard: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <SearchBar selectedTags={selectedTags} />
      <TagList selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <SnippetList />
    </div>
  );
};

export default Dashboard;
