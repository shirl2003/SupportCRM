import React, { useState } from "react";
import { addNote } from "../api/notesApi";

const NoteSection = ({ notes, ticketId, onNoteAdded }) => {
  const [noteText, setNoteText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!noteText.trim()) {
      setError("Note cannot be empty");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await addNote(ticketId, noteText);
      setNoteText("");
      onNoteAdded();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
          {notes?.length || 0}
        </span>
      </div>

      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
        {notes && notes.length > 0 ? (
          [...notes].reverse().map((note) => (
            <div
              key={note.id}
              className="bg-gray-50 rounded-lg p-3 border-l-4 border-indigo-300 relative"
            >
              <p className="text-gray-700 text-sm whitespace-pre-wrap mb-4">
                {note.note_text}
              </p>
              <div className="text-right">
                <span className="text-gray-400 text-xs">
                  {formatDate(note.created_at)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-6">
            📝 No notes yet
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <textarea
          rows="3"
          placeholder="Write a note..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting && (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          )}
          Add Note
        </button>
      </div>
    </div>
  );
};

export default NoteSection;
