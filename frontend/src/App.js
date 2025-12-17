import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CaseDetail from "./pages/CaseDetail";
import AddCase from "./pages/AddCase";
import Register from "./pages/Register";
import Users from "./pages/Users";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import { Box } from "@mui/material";
import FloatingChat from "./components/FloatingChat";
import CaseForm from "./pages/CaseForm";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ProtectedLayout from "./routes/ProtectedLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Sticky Navbar */}
        <Box sx={{ position: "sticky", top: 0, zIndex: 1100 }}>
          <Navbar />
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </PrivateRoute>} />
            <Route path="/cases/:id" element={<PrivateRoute><CaseForm key="edit" /></PrivateRoute>} />
            <Route path="/cases/new" element={<PrivateRoute><CaseForm key="add" /></PrivateRoute>} />
            <Route path="/users" element={
              <PrivateRoute>
                <RoleRoute role="admin"><Users /></RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/register" element={
              <PrivateRoute>
                <RoleRoute role="admin"><Register /></RoleRoute>
              </PrivateRoute>
            } />
          </Routes>
        </Box>
        <FloatingChat />
        {/* Footer */}
        <Footer />
      </Box>
    </BrowserRouter>
  );
}
