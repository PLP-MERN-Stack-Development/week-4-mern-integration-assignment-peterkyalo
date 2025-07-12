import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await authService.login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-lg shadow space-y-4 border border-blue-100">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">Login</h2>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="block w-full mb-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="block w-full mb-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Login</button>
        {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
