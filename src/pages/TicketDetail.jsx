import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTicketById, updateTicket } from "../api/ticketsApi";
import { getNotesByTicket } from "../api/notesApi";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import NoteSection from "../components/NoteSection";
import Toast from "../components/Toast";

const TicketDetail = () => {
  const { ticket_id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const fetchTicketData = useCallback(async () => {
    setLoading(true);
    try {
      const ticketData = await getTicketById(ticket_id);
      setTicket(ticketData);
      setNotes(ticketData.notes || []);
      setNewStatus(ticketData.status);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  }, [ticket_id]);

  const refreshNotes = async () => {
    try {
      const notesData = await getNotesByTicket(ticket_id);
      setNotes(notesData);
    } catch (err) {
      console.error("Failed to refresh notes", err);
    }
  };

  useEffect(() => {
    fetchTicketData();
  }, [fetchTicketData]);

  const handleUpdateStatus = async () => {
    setUpdatingStatus(true);
    try {
      await updateTicket(ticket_id, { status: newStatus });
      setToastMsg(`Status updated to ${newStatus}!`);
      setShowToast(true);
      // Refresh ticket to get updated last_updated field etc.
      const updatedTicket = await getTicketById(ticket_id);
      setTicket(updatedTicket);
    } catch (err) {
      setToastMsg("Failed to update status");
      setShowToast(true);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-500">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-gray-300 mb-4 text-6xl">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900">Ticket not found</h1>
            <p className="text-gray-500 mt-2 mb-8">
              The ticket you are looking for does not exist or has been deleted.
            </p>
            <Link
              to="/"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors w-fit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Tickets
          </button>

          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket #{ticket?.ticket_id.slice(0, 8)}
            </h1>
            <StatusBadge status={ticket?.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Ticket Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Customer Info */}
              <div className="flex items-center gap-4 text-sm mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">👤</span>
                  <span className="font-bold text-gray-900">
                    {ticket?.customer_name}
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">✉️</span>
                  <span className="text-indigo-600 font-medium">
                    {ticket?.customer_email}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <span className="text-gray-500 uppercase text-xs font-bold tracking-wider">
                  Subject
                </span>
                <h2 className="text-xl font-semibold text-gray-900 mt-1">
                  {ticket?.subject}
                </h2>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              {/* Description */}
              <div className="mb-6">
                <span className="text-gray-500 uppercase text-xs font-bold tracking-wider">
                  Description
                </span>
                <p className="text-gray-700 leading-relaxed mt-2 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-50">
                  {ticket?.description}
                </p>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium block mb-1">Created:</span>
                  <span>{formatDate(ticket?.created_at)}</span>
                </div>
                <div>
                  <span className="font-medium block mb-1">Last Updated:</span>
                  <span>{formatDate(ticket?.updated_at)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              {/* Update Status */}
              <div>
                <label className="block text-gray-500 uppercase text-xs font-bold tracking-wider mb-3">
                  Update Status
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 max-w-[200px] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus || newStatus === ticket?.status}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm text-sm"
                  >
                    {updatingStatus && (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    )}
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Notes */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <NoteSection
                notes={notes}
                ticketId={ticket_id}
                onNoteAdded={refreshNotes}
              />
            </div>
          </div>
        </div>
      </main>

      {showToast && (
        <Toast
          message={toastMsg}
          type={toastMsg.includes("Failed") ? "error" : "success"}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default TicketDetail;
