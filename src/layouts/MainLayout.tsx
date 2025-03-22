import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import AuthenticatedNav from '../components/AuthenticatedNav';
import AdminNav from '../components/AdminNav';

export function MainLayout() {
  const { isAuthenticated, role, handleLogin, handleLogout } = useAuth();
  
  const renderNavigation = () => {
    if (!isAuthenticated) {
      return <Navbar onLogin={handleLogin} />;
    }
    
    if (role === 'ADMIN') {
      return <AdminNav onLogout={handleLogout} />;
    }
    
    return <AuthenticatedNav onLogout={handleLogout} />;
  };

  return (
    <div className="">
      {renderNavigation()}
      {/* Add your main content here */}
      <div className="container mx-auto p-4">
        <p className="text-gray-600">Current role: {role || 'Not authenticated'}</p>
      </div>
    </div>
  );
}