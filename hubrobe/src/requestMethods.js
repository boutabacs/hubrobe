import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "https://final-project-ang9.onrender.com/api/";

// Pour les requêtes publiques (produits, etc.)
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});

// Ajouter un intercepteur pour injecter le token dynamiquement
userRequest.interceptors.request.use((config) => {
  const user = JSON.parse(
    sessionStorage.getItem("user") ||
      localStorage.getItem("user") ||
      Cookies.get("user") ||
      "null",
  );
  const TOKEN = user?.accessToken;
  if (TOKEN) {
    config.headers.token = `Bearer ${TOKEN}`;
  }
  return config;
});

// Ajouter un intercepteur pour gérer les erreurs de token expiré (403 ou 401)
userRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Si le token est expiré ou invalide, on déconnecte l'utilisateur
      sessionStorage.removeItem("user");
      localStorage.removeItem("user");
      Cookies.remove("user");

      // On redirige vers la page de login seulement si on n'y est pas déjà
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
