import React, { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgClass} text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-2`}>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 focus:outline-none font-bold"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
