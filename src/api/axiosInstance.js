import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backendapi-production-abee.up.railway.app/api",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor:
// Read token from localStorage key "crm_token"
// If token exists, add header: Authorization: Bearer {token}
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("crm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor:
// If response status is 401, clear localStorage and
// redirect to /login using window.location.href
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("crm_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
