import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TransferPage } from "./pages/TransferPage";
import { TransferConfirmationPage } from "./pages/TransferConfirmationPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { AIAssistantPage } from "./pages/AIAssistantPage";
import { SecurityDashboardPage } from "./pages/SecurityDashboardPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { BankerDashboardPage } from "./pages/BankerDashboardPage";
import { ManagerDashboardPage } from "./pages/ManagerDashboardPage";

export const App: React.FC = () => {
  return (
    <div
      className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-[#00D2FF]/30 selection:text-slate-900 bg-[#F8FAFC]"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/security-events" element={<SecurityDashboardPage />} />

          {/* Customer Banking Workflows */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/transfer"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <TransferPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfer/confirm"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <TransferConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <AIAssistantPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Authenticated Notifications */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Staff & Governance Portals */}
          <Route
            path="/banker"
            element={
              <ProtectedRoute allowedRoles={["BANKER", "MANAGER"]}>
                <BankerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <ManagerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
