import React from 'react';
import CollectionList from '../components/Collections/CollectionList';

const CollectionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CollectionList />
    </div>
  );
};

export default CollectionsPage;