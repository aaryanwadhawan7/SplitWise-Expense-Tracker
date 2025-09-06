import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  // If not logged in, redirect to login page.
  // If logged in, render children (the protected component).
  return currentUser ? children : <Navigate to="/login" replace />;
}
