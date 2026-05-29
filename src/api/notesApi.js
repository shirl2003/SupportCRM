import api from "./axiosInstance";

export const addNote = async (ticketId, noteText) => {
  try {
    const response = await api.post(`/notes/ticket/${ticketId}`, {
      note_text: noteText,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNotesByTicket = async (ticketId) => {
  try {
    const response = await api.get(`/notes/ticket/${ticketId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
