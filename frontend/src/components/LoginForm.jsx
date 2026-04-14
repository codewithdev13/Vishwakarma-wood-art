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
    <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 space-y-6">
      <h2 className="text-3xl font-bold text-center text-wood-dark">Admin Login</h2>
      {error && <div className="text-red-500 text-center text-sm bg-red-50 p-2 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wood-dark focus:ring-wood-dark sm:text-sm p-3 border"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wood-dark focus:ring-wood-dark sm:text-sm p-3 border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wood-dark hover:bg-wood focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wood-dark transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
