import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./api"; // registers global axios interceptor for invalid token redirect
import "./index.css";
import "./styles/animations.css";
import "./styles/Neon.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import store from "./store/index.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </Router>
  </StrictMode>
);
