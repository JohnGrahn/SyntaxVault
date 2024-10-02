import React from 'react';
import SnippetList from '../components/Snippets/SnippetList';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SnippetList />
    </div>
  );
};

export default Dashboard;