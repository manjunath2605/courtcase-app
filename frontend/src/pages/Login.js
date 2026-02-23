import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.response?.data?.msg || "Invalid username or password");
      }
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
          "linear-gradient(rgba(11,28,57,0.65), rgba(11,28,57,0.65)), url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: 380 },
          p: 3,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.95)",
          boxShadow: 6
        }}
      >
      <Typography variant="h5" mb={2}>Login</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={login}>
        <TextField
          label="Email"
          name="email"
          value={form.email}
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          disabled={loading}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={form.password}
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
        >
          {loading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} color="inherit" />
              <span>Logging in...</span>
            </Stack>
          ) : "Login"}
        </Button>

        <Button
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </Button>
      </form>
      </Box>
    </Box>
  );
}
