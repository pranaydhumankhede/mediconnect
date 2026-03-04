import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/about"       element={<AboutPage />} />
        <Route path="/symptoms"    element={<SymptomCheckerPage />} />
        <Route path="/login"       element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register"    element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/profile"     element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*"            element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
