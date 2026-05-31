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
    const newErrors = {};
    if (!formData.customer_name) newErrors.customer_name = "Name is required";
    if (!formData.customer_email) {
      newErrors.customer_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = "Invalid email format";
    }
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.description) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setApiError("");
    try {
      const data = await createTicket(formData);
      setSuccessTicketId(data.ticket_id);
      setTimeout(() => {
        navigate(`/tickets/${data.ticket_id}`);
      }, 1500);
    } catch (err) {
      setApiError(err.response?.data?.detail || "Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 mb-8 transition-colors text-base"
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

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Create New Ticket</h1>
                <p className="text-gray-600 text-lg">
                  Fill in the customer details to open a support ticket
                </p>
              </div>

              {successTicketId && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 text-base font-semibold">
                  <svg className="h-7 w-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ticket {successTicketId} created successfully! Redirecting...
                </div>
              )}

              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 text-base font-semibold">
                  <svg className="h-7 w-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {apiError}
                </div>
              )}

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-3">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full border-2 rounded-xl px-5 py-4 text-base focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-200 ${
                        errors.customer_name ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500"
                      }`}
                    />
                    {errors.customer_name && (
                      <p className="text-red-600 text-sm mt-2 font-medium">{errors.customer_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-3">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full border-2 rounded-xl px-5 py-4 text-base focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-200 ${
                        errors.customer_email ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500"
                      }`}
                    />
                    {errors.customer_email && (
                      <p className="text-red-600 text-sm mt-2 font-medium">{errors.customer_email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief summary of the issue"
                    className={`w-full border-2 rounded-xl px-5 py-4 text-base focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-200 ${
                      errors.subject ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500"
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-red-600 text-sm mt-2 font-medium">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="6"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed description of the customer's problem..."
                    className={`w-full border-2 rounded-xl px-5 py-4 text-base focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-200 ${
                      errors.description ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-2 font-medium">{errors.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-4 pt-6">
                  <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-100 border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 text-gray-800 px-8 py-4 rounded-xl font-semibold transition-all duration-200 text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !!successTicketId}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 hover:shadow-xl text-base"
                  >
                    {submitting && (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-3 border-b-3 border-white"></div>
                    )}
                    Create Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateTicket;
