import { useState } from "react";
import api from "../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      setSuccess("User added successfully");
      setForm({ name: "", email: "", password: "", role: "user" });

      setTimeout(() => navigate("/users"), 1200);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        backgroundImage:
          "linear-gradient(rgba(28,22,45,0.68), rgba(28,22,45,0.68)), url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <Card sx={{ width: 420, bgcolor: "rgba(255,255,255,0.96)", boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          {/* HEADER */}
          <Typography variant="overline" sx={{ letterSpacing: 2, color: "#4f3d72", fontWeight: 700 }}>
            Administration
          </Typography>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Add New User
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Create a new user and assign access role
          </Typography>

          {/* ALERTS */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {/* FORM */}
          <form onSubmit={submit}>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                select
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="viewer">Viewer (Read Only)</MenuItem>
              </TextField>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create User"}
              </Button>

              <Button
                variant="text"
                onClick={() => navigate("/users")}
              >
                Cancel
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
