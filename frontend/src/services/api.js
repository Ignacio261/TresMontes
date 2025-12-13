// src/services/api.js
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// INCLUIR TOKEN EN CADA REQUEST
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// REFRESH TOKEN AUTOMÁTICO
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const r = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh,
          });

          const newAccess = r.data.access;
          localStorage.setItem("access_token", newAccess);
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original);

        } catch (err) {
          console.error("Refresh token expirado");
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
