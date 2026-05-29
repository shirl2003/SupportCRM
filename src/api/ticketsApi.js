import api from "./axiosInstance";

export const getAllTickets = async (status = "", search = "") => {
  try {
    let url = "/tickets/";
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTicket = async (data) => {
  try {
    const response = await api.post("/tickets/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTicket = async (ticketId, data) => {
  try {
    const response = await api.put(`/tickets/${ticketId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    const response = await api.delete(`/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
