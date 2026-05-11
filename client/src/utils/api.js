import axios from "axios";

const API = axios.create({
  // Live deployment ke liye localhost hata kar sirf '/api' rakhein
  baseURL: "/api", 
});

// Add auth header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
