import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const NavBar = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 shadow sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex gap-8 items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white hover:text-blue-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            MERN Blog
          </Link>
          <Link to="/" className="text-white hover:text-blue-100 transition text-lg">Home</Link>
          <Link to="/create" className="text-white hover:text-blue-100 transition text-lg">Create Post</Link>
        </div>
        <div className="flex gap-4 items-center">
          {!user && <Link to="/register" className="text-white hover:text-blue-100 transition text-lg">Register</Link>}
          {!user && <Link to="/login" className="text-white hover:text-blue-100 transition text-lg">Login</Link>}
          {user && <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition text-lg font-semibold">Logout</button>}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
