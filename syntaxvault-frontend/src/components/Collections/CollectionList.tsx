import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchCollections, deleteCollection } from '../../features/collections/collectionsSlice';
import { Link } from 'react-router-dom';

const CollectionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { collections, loading, error } = useAppSelector((state) => state.collections);

  useEffect(() => {
    dispatch(fetchCollections());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      dispatch(deleteCollection(id));
    }
  };

  if (loading) return <p>Loading collections...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Your Collections</h2>
        <Link to="/dashboard/add-collection" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Collection
        </Link>
      </div>
      {collections.length === 0 ? (
        <p>No collections available. Add some!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {collections.map((collection) => (
            <div key={collection.id} className="border rounded p-4 shadow">
              <div className="flex justify-between items-center">
                <Link to={`/dashboard/collections/${collection.id}`} className="text-xl font-semibold">
                  {collection.name}
                </Link>
                <div>
                  <Link to={`/dashboard/edit-collection/${collection.id}`} className="text-yellow-500 mr-2">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(collection.id)} className="text-red-500">
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600">Snippets: {collection.snippetIds.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionList;