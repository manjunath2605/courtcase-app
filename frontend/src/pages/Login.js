import { useState } from "react";
import { Button, TextField, Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      const storage = remember ? localStorage : sessionStorage;

      storage.setItem("token", res.data.token);
      storage.setItem("user", JSON.stringify(res.data.user));

      // Always sync to localStorage for API
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <Box sx={{ width: { xs: '90%', sm: 350 }, mx: "auto", mt: { xs: 5, sm: 10 } }}>
      <Typography variant="h5" mb={2}>Login</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={submit}>
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />

        <FormControlLabel
          control={
            <Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} />
          }
          label="Remember me"
        />

        <Button type="submit" variant="contained" fullWidth>
          Login
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
  );
}