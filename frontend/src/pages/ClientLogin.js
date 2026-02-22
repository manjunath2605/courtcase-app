import { useState } from "react";
import { Box, Button, TextField, Typography, Stack, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await api.post("/auth/client/request-otp", { email });
      setOtpRequested(true);
      setInfo("OTP sent to your registered case email.");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await api.post("/auth/client/verify-otp", { email, otp });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: { xs: "90%", sm: 350 }, mx: "auto", mt: { xs: 5, sm: 10 } }}>
      <Typography variant="h5" mb={2}>Client Login</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {info && <Typography color="primary" sx={{ mb: 1 }}>{info}</Typography>}

      <form onSubmit={otpRequested ? verifyOtp : requestOtp}>
        <TextField
          label="Registered Case Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading || otpRequested}
        />

        {otpRequested && (
          <TextField
            label="Enter OTP"
            fullWidth
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            disabled={loading}
          />
        )}

        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          {loading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} color="inherit" />
              <span>{otpRequested ? "Verifying..." : "Sending OTP..."}</span>
            </Stack>
          ) : otpRequested ? "Verify OTP" : "Send OTP"}
        </Button>

        {otpRequested && (
          <Button fullWidth sx={{ mt: 1 }} onClick={requestOtp} disabled={loading}>
            Resend OTP
          </Button>
        )}
      </form>
    </Box>
  );
}
