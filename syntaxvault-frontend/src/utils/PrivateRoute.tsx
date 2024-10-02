import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';

const PrivateRoute: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;