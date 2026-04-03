import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

// For regular requests
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});

userRequest.interceptors.request.use((config) => {
  const TOKEN = localStorage.getItem("adminToken");
  if (TOKEN) {
    config.headers.token = `Bearer ${TOKEN}`;
  }
  return config;
});
