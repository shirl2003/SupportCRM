import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../api/ticketsApi";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successTicketId, setSuccessTicketId] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.customer_name) errs.customer_name = "Name is required";
    if (!formData.customer_email) errs.customer_email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) errs.customer_email = "Invalid email format";
    if (!formData.subject) errs.subject = "Subject is required";
    if (!formData.description) errs.description = "Description is required";
    else if (formData.description.length < 10) errs.description = "At least 10 characters required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const u = { ...prev }; delete u[name]; return u; });
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSubmitting(true);
    setApiError("");
    try {
      const data = await createTicket(formData);
      setSuccessTicketId(data.ticket_id);
      setTimeout(() => navigate(`/tickets/${data.ticket_id}`), 1500);
    } catch (err) {
      setApiError(err.response?.data?.detail || "Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (field) =>
    `w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 focus:bg-white ${
      errors[field]
        ? "border-red-300 focus:ring-red-100 focus:border-red-400"
        : "border-gray-300 focus:ring-indigo-100 focus:border-indigo-500"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium mb-5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tickets
            </button>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Card header */}
              <div className="px-6 py-4 border-b border-gray-100">
                <h1 className="text-lg font-bold text-gray-900">New Support Ticket</h1>
                <p className="text-sm text-gray-500 mt-0.5">Fill in the details to open a support request.</p>
              </div>

              <div className="px-6 py-5 space-y-5">
                {successTicketId && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5 font-medium">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ticket created successfully! Redirecting...
                  </div>
                )}
                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {apiError}
                  </div>
                )}

                {/* Customer Info */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Customer Name</label>
                      <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder="John Doe" className={inputCls("customer_name")} />
                      {errors.customer_name && <p className="text-xs text-red-600 mt-1">{errors.customer_name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Customer Email</label>
                      <input type="email" name="customer_email" value={formData.customer_email} onChange={handleChange} placeholder="john@example.com" className={inputCls("customer_email")} />
                      {errors.customer_email && <p className="text-xs text-red-600 mt-1">{errors.customer_email}</p>}
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ticket Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subject</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Brief description of the issue" className={inputCls("subject")} />
                      {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
                      <textarea name="description" rows={5} value={formData.description} onChange={handleChange} placeholder="Detailed description of the customer's issue..." className={inputCls("description")} />
                      {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !!successTicketId}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateTicket;
