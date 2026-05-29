import React from "react";

const StatusBadge = ({ status }) => {
  const getStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "closed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold border ${getStyles(
        status
      )}`}
    >
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;
