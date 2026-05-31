import React from "react";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4"></div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-base font-bold text-gray-800">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-400 rounded-xl transition-all duration-200 border border-gray-300 shadow-sm hover:shadow-md"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
