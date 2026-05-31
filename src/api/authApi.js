import api from "./axiosInstance";

export const registerUser = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/auth/users");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, data) => {
  try {
    const response = await api.put(`/auth/users/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
