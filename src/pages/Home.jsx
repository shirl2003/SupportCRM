import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTickets, deleteTicket } from "../api/ticketsApi";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatusBadge from "../components/StatusBadge";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const navigate = useNavigate();

  const fetchTickets = useCallback(async (status = "", query = "") => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllTickets(status, query);
      setTickets(data);
    } catch (err) {
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets(activeFilter, search);
  }, [activeFilter, fetchTickets]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets(activeFilter, search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, activeFilter, fetchTickets]);

  const handleDelete = async (e, ticketId) => {
    e.stopPropagation();
    try {
      await deleteTicket(ticketId);
      fetchTickets(activeFilter, search);
    } catch (err) {
      setError("Failed to delete ticket. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
                <span className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-base font-semibold">
                  {tickets.length}
                </span>
              </div>
              <button
                onClick={() => navigate("/create")}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl flex items-center gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create New Ticket
              </button>
            </div>

            <div className="flex flex-col gap-6 mb-10">
              <SearchBar value={search} onChange={setSearch} />
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                <p className="mt-6 text-gray-600 text-lg">Loading tickets...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-16 text-center shadow-lg">
                <div className="text-red-600 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-red-800">{error}</h3>
                <button
                  onClick={() => fetchTickets(activeFilter, search)}
                  className="mt-6 bg-red-100 hover:bg-red-200 text-red-700 px-8 py-3 rounded-xl font-semibold transition-colors shadow-md"
                >
                  Retry
                </button>
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-24 text-center shadow-xl">
                <div className="text-gray-300 mb-6 text-8xl">🎫</div>
                <h3 className="text-2xl font-bold text-gray-900">No tickets found</h3>
                <p className="text-gray-600 mt-3 text-lg">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-sm font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-8 py-6">Ticket ID</th>
                        <th className="px-8 py-6">Customer</th>
                        <th className="px-8 py-6">Subject</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6">Created</th>
                        <th className="px-8 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tickets.map((ticket) => (
                        <tr
                          key={ticket.ticket_id}
                          onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        >
                          <td className="px-8 py-6">
                            <span className="font-mono text-base text-indigo-600 font-bold">
                              #{ticket.ticket_id?.toString().slice(0, 8)}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-1">
                              <span className="text-base font-bold text-gray-900">
                                {ticket.customer_name}
                              </span>
                              <span className="text-gray-600 text-sm">
                                {ticket.customer_email}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-base text-gray-800 max-w-md truncate">
                              {ticket.subject}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <StatusBadge status={ticket.status} />
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-base text-gray-700">
                              {formatDate(ticket.created_at)}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tickets/${ticket.ticket_id}`);
                                }}
                                className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-xl font-semibold transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, ticket.ticket_id)}
                                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 rounded-xl font-semibold transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
