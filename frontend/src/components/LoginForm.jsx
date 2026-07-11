import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', { username, password });
      sessionStorage.setItem('adminToken', data.token);
      setAuth(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="max-w-md w-full bg-background border border-primary/10 shadow-xl rounded-[2rem] p-8 space-y-6">
      <h2 className="text-3xl font-heading font-extrabold text-center text-primary">Admin Login</h2>
      {error && <div className="text-red-500 text-center text-sm bg-red-50 p-2 rounded-lg border border-red-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Username</label>
          <input
            type="text"
            className="mt-1 block w-full bg-background border-primary/20 rounded-xl shadow-sm focus:border-accent focus:ring-accent text-sm p-3 border outline-none transition-all duration-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Password</label>
          <input
            type="password"
            className="mt-1 block w-full bg-background border-primary/20 rounded-xl shadow-sm focus:border-accent focus:ring-accent text-sm p-3 border outline-none transition-all duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-primary bg-accent hover:bg-accent/90 transition-all duration-300 uppercase tracking-wider cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
