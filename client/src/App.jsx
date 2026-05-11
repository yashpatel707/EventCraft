import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";
import Contact from "./pages/Contact";

import Navbar from "./components/Navbar";

export default function App() {
  const role = localStorage.getItem("role");

  const ProtectedAdmin = () => {
    return role === "admin" ? <Admin /> : <Navigate to="/" />;
  };

  const ProtectedDashboard = () => {
    return role === "user" ? <Dashboard /> : <Navigate to="/" />;
  };

  const ProtectedEmployee = () => {
    return role === "employee" ? <Employee /> : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ✅ HOME FIRST */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
        <Route path="/employee" element={<ProtectedEmployee />} />
      </Routes>
    </BrowserRouter>
  );
}
