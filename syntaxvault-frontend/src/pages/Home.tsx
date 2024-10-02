import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to SyntaxVault</h1>
      <p className="text-lg mb-8 text-center">
        Your personal library for storing, organizing, and accessing your code snippets effortlessly.
      </p>
      <div>
        <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded mr-4 hover:bg-blue-600">
          Login
        </Link>
        <Link to="/register" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;