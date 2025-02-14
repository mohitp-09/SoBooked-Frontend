import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import AuthenticatedNav from '../components/AuthenticatedNav';

export function MainLayout() {
  const { isAuthenticated, handleLogin, handleLogout } = useAuth();
  console.log("isAuthenticated:", isAuthenticated);
  return (
    <div className="">
      {isAuthenticated ? (
        <AuthenticatedNav onLogout={handleLogout} />
      ) : (
        <Navbar onLogin={handleLogin} />
      )}
    </div>
  );
}