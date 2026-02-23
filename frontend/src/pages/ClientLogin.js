import { useState } from "react";
import { Box, Button, TextField, Typography, Stack, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [caseNo, setCaseNo] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginWithCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/client/login-with-code", { caseNo, accessCode });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.removeItem("user");

      navigate("/dashboard");
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.response?.data?.msg || "Invalid case number or access code");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: { xs: "90%", sm: 350 }, mx: "auto", mt: { xs: 5, sm: 10 } }}>
      <Typography variant="h5" mb={2}>Client Login</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={loginWithCode}>
        <TextField
          label="Case Number"
          fullWidth
          margin="normal"
          value={caseNo}
          onChange={(e) => setCaseNo(e.target.value)}
          required
          disabled={loading}
        />

        <TextField
          label="Access Code"
          type="password"
          fullWidth
          margin="normal"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          required
          disabled={loading}
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
          ) : "Login with Code"}
        </Button>
      </form>
    </Box>
  );
}
