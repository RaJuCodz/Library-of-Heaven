import axios from "axios";
import store from "./store/index";
import { authActions } from "./store/auth";

const API_BASE = import.meta.env.VITE_API_URL;

export const apiUrl = (route) => `${API_BASE}${route}`;

// Global interceptor — covers every axios call in the app
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("role");
      store.dispatch(authActions.logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
