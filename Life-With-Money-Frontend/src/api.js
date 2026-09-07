import axios from "axios";

const API = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") + "/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      const token = localStorage.getItem("token");
      if (token) {
        // Session expired/invalid — clear it and let protected routes redirect
        localStorage.removeItem("token");
        if (
          window.location.pathname !== "/" &&
          !window.location.hash.includes("/Login")
        ) {
          window.location.hash = "/Login";
        }
      }
    }
    return Promise.reject(err);
  }
);

export default API;