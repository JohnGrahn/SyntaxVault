import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const { snippets } = useAppSelector((state) => state.snippets);
  const { collections } = useAppSelector((state) => state.collections);

  const userSnippets = snippets.filter(snippet => snippet.username === auth.user);
  const userCollections = collections.filter(collection => collection.username === auth.user);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Account Information</h2>
          <p className="text-gray-600">Username: {auth.user}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-lg font-medium">Total Snippets</p>
              <p className="text-3xl font-bold text-blue-600">{userSnippets.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-lg font-medium">Total Collections</p>
              <p className="text-3xl font-bold text-green-600">{userCollections.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Recent Snippets</h2>
            {userSnippets.slice(0, 3).map(snippet => (
              <Link 
                key={snippet.id}
                to={`/dashboard/snippets/${snippet.id}`}
                className="block bg-gray-50 p-3 rounded mb-2 hover:bg-gray-100"
              >
                <p className="font-medium">{snippet.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(snippet.creationDate).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Recent Collections</h2>
            {userCollections.slice(0, 3).map(collection => (
              <Link
                key={collection.id}
                to={`/dashboard/collections/${collection.id}`}
                className="block bg-gray-50 p-3 rounded mb-2 hover:bg-gray-100"
              >
                <p className="font-medium">{collection.name}</p>
                <p className="text-sm text-gray-600">
                  {collection.snippetIds.length} snippets
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;