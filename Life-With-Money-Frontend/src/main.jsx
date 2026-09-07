import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastProvider } from "./components/Toast";
import "./index.css";
import App from "./App.jsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <GoogleOAuthProvider clientId={googleClientId} onScriptLoadError={() => {}}>
        <HashRouter>
          <App />
        </HashRouter>
      </GoogleOAuthProvider>
    </ToastProvider>
  </StrictMode>
);