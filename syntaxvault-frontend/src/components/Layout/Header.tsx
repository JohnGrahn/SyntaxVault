// src/components/Layout/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../features/auth/authSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold">
          SyntaxVault
        </Link>
        <Link to="/public-snippets" className="hover:text-gray-200">
          Public Snippets
        </Link>
        <Link to="/public-collections" className="hover:text-gray-200">
          Public Collections
        </Link>
      </div>
      <nav>
        {user ? (
          <>
            <Link to="/dashboard" className="mr-4">
              Home
            </Link>
            <Link to="/dashboard/collections" className="mr-4">
              Collections
            </Link>
            <Link to="/dashboard/folders" className="mr-4">
              Folders
            </Link>
            <Link to="/dashboard/profile" className="mr-4">
              Profile
            </Link>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
