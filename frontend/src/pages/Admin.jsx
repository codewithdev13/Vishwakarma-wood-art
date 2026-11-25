import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    document.title = "Admin | Vishwakarma Wood Art";
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mb-4 flex justify-start">
        <Link 
          to="/" 
          className="text-sm font-semibold text-text-muted hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/5 border border-primary/10"
        >
          ← Back to Store
        </Link>
      </div>
      {!isAuthenticated ? (
        <LoginForm setAuth={setIsAuthenticated} />
      ) : (
        <Dashboard setAuth={setIsAuthenticated} />
      )}
    </div>
  );
};

export default Admin;
