import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold text-white">
          🎫 Support CRM
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`${
              isActive("/") ? "text-indigo-400" : "text-gray-300 hover:text-white"
            } transition-colors`}
          >
            Home
          </Link>
          <Link
            to="/create"
            className={`${
              isActive("/create") ? "text-indigo-400" : "text-gray-300 hover:text-white"
            } transition-colors`}
          >
            New Ticket
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm font-medium text-gray-300">
            {user.name}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors border border-gray-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
