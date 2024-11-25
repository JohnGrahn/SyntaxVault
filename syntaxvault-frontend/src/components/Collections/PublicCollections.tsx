import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchPublicCollections } from '../../features/collections/collectionsSlice';
import { Link } from 'react-router-dom';

const PublicCollections: React.FC = () => {
  const dispatch = useAppDispatch();
  const { publicCollections, loading, error } = useAppSelector((state) => state.collections);

  useEffect(() => {
    dispatch(fetchPublicCollections());
  }, [dispatch]);

  if (loading) return <p>Loading public collections...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Public Collections</h2>
      <div className="grid grid-cols-1 gap-4">
        {publicCollections.map((collection) => (
          <div key={collection.id} className="border rounded p-4 shadow">
            <div className="flex justify-between items-center">
              <Link to={`/public-collections/${collection.id}`} className="text-xl font-semibold">
                {collection.name}
              </Link>
            </div>
            <p className="text-gray-600">By: {collection.username}</p>
            <p className="text-gray-600">Snippets: {collection.snippetIds.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicCollections; 