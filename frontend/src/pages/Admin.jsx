import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {!isAuthenticated ? (
        <LoginForm setAuth={setIsAuthenticated} />
      ) : (
        <Dashboard setAuth={setIsAuthenticated} />
      )}
    </div>
  );
};

export default Admin;
