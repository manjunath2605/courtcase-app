import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CaseDetail from "./pages/CaseDetail";
import AddCase from "./pages/AddCase";
import Register from "./pages/Register";
import Users from "./pages/Users";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import { Box } from "@mui/material";

export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Sticky Navbar */}
        <Box sx={{ position: "sticky", top: 0, zIndex: 1100 }}>
          <Navbar />
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/cases/:id" element={<PrivateRoute><CaseDetail /></PrivateRoute>} />
            <Route path="/add" element={<PrivateRoute><AddCase /></PrivateRoute>} />
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

        {/* Footer */}
        <Footer />
      </Box>
    </BrowserRouter>
  );
}
