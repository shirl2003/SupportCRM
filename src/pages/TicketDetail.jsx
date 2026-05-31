import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTicketById, updateTicket } from "../api/ticketsApi";
import { getNotesByTicket } from "../api/notesApi";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
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
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
              <p className="mt-6 text-gray-600 text-lg">Loading ticket details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-16 text-center">
                <div className="text-gray-300 mb-8 text-8xl">🔍</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Ticket not found</h1>
                <p className="text-gray-600 text-lg mb-10">
                  The ticket you are looking for does not exist or has been deleted.
                </p>
                <Link
                  to="/"
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-8 mb-10">
              <button
                onClick={() => navigate(-1)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 transition-colors w-fit text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Tickets
              </button>

              <div className="flex items-center gap-5 flex-wrap">
                <h1 className="text-4xl font-bold text-gray-900">
                  Ticket #{ticket?.ticket_id.slice(0, 8)}
                </h1>
                <StatusBadge status={ticket?.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
                  <div className="flex items-center gap-6 text-base mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-lg">
                          {ticket?.customer_name}
                        </span>
                        <span className="text-indigo-600 font-medium text-base">
                          {ticket?.customer_email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <span className="text-gray-500 uppercase text-sm font-bold tracking-widest">
                      Subject
                    </span>
                    <h2 className="text-2xl font-semibold text-gray-900 mt-2">
                      {ticket?.subject}
                    </h2>
                  </div>

                  <div className="border-t-2 border-gray-100 my-8"></div>

                  <div className="mb-8">
                    <span className="text-gray-500 uppercase text-sm font-bold tracking-widest mb-3 block">
                      Description
                    </span>
                    <div className="text-gray-700 leading-relaxed mt-3 whitespace-pre-wrap bg-gray-50 p-6 rounded-2xl border border-gray-100 text-lg">
                      {ticket?.description}
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-100 my-8"></div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-base text-gray-600 mb-8">
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <span className="font-bold text-gray-800 block mb-2 text-sm uppercase tracking-wider">Created</span>
                      <span className="text-lg">{formatDate(ticket?.created_at)}</span>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <span className="font-bold text-gray-800 block mb-2 text-sm uppercase tracking-wider">Last Updated</span>
                      <span className="text-lg">{formatDate(ticket?.updated_at)}</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-100 my-8"></div>

                  <div>
                    <label className="block text-gray-500 uppercase text-sm font-bold tracking-widest mb-5">
                      Update Status
                    </label>
                    <div className="flex items-center gap-4">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="flex-1 max-w-[300px] border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <button
                        onClick={handleUpdateStatus}
                        disabled={updatingStatus || newStatus === ticket?.status}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg shadow-indigo-200 hover:shadow-xl text-lg"
                      >
                        {updatingStatus && (
                          <div className="animate-spin rounded-full h-6 w-6 border-t-3 border-b-3 border-white"></div>
                        )}
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-8">
                  <NoteSection
                    notes={notes}
                    ticketId={ticket_id}
                    onNoteAdded={refreshNotes}
                  />
                </div>
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
    </div>
  );
};

export default TicketDetail;