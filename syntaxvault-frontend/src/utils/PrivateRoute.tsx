import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const PrivateRoute: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return isTokenValid(token) ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;