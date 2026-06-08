import axios from "axios";

const BASE_URL = "https://final-project-ang9.onrender.com/api/";

// For regular requests
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});

userRequest.interceptors.request.use((config) => {
  const TOKEN = sessionStorage.getItem("adminToken");
  if (TOKEN) {
    config.headers.token = `Bearer ${TOKEN}`;
  }
  return config;
});

// Add response interceptor to handle expired token (403 or 401)
userRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Clear admin session
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminUser");

      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
