import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const trimmedUser = username.trim();
      const trimmedPass = password.trim();

      const { data } = await axios.post('/api/auth/login', { 
        username: trimmedUser, 
        password: trimmedPass 
      });

      if (data && data.token) {
        sessionStorage.setItem('adminToken', data.token);
        setAuth(true);
      } else {
        setError('Login failed: Token not received.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.message && err.message.includes('Network Error')) {
        setError('Network Error: Unable to reach backend API. Please try again.');
      } else {
        setError('Invalid username or password. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-background border border-primary/10 shadow-xl rounded-[2rem] p-8 space-y-6">
      <h2 className="text-3xl font-heading font-extrabold text-center text-primary">Admin Login</h2>
      {error && (
        <div className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Username</label>
          <input
            type="text"
            autoComplete="username"
            className="mt-1 block w-full bg-background border-primary/20 rounded-xl shadow-sm focus:border-accent focus:ring-accent text-sm p-3 border outline-none transition-all duration-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="e.g. admin"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            className="mt-1 block w-full bg-background border-primary/20 rounded-xl shadow-sm focus:border-accent focus:ring-accent text-sm p-3 border outline-none transition-all duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-primary transition-all duration-300 uppercase tracking-wider cursor-pointer ${
            loading ? 'bg-accent/60 cursor-not-allowed' : 'bg-accent hover:bg-accent/90'
          }`}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
