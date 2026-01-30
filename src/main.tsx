import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import ScorecardPage from "./components/ScorecardPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Legacy route - original app */}
        <Route path="/" element={<App />} />

        {/* Config-driven scorecard routes */}
        <Route path="/scorecards/:slug" element={<ScorecardPage />} />

        {/* Redirect /scorecards to default scorecard */}
        <Route path="/scorecards" element={<Navigate to="/scorecards/marketing-reality-check" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
