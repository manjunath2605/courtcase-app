import { useEffect, useState } from "react";
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
  const [otpCooldown, setOtpCooldown] = useState(0);

  useEffect(() => {
    if (otpCooldown <= 0) return undefined;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await api.post("/auth/client/request-otp", { email });
      setOtpRequested(true);
      setOtpCooldown(60);
      setInfo("OTP sent to your registered case email.");
    } catch (err) {
      if (err.response?.status === 429) {
        const retryAfter = Number(err.response?.data?.retryAfter) || 60;
        setOtpCooldown(retryAfter);
        setError(`Please wait ${retryAfter}s before requesting OTP again.`);
      } else if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.response?.data?.msg || "Failed to send OTP");
      }
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

      localStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.removeItem("user");

      navigate("/dashboard");
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.response?.data?.msg || "Invalid OTP");
      }
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

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || (!otpRequested && otpCooldown > 0)}
        >
          {loading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} color="inherit" />
              <span>{otpRequested ? "Verifying..." : "Sending OTP..."}</span>
            </Stack>
          ) : otpRequested ? "Verify OTP" : otpCooldown > 0 ? `Try again in ${otpCooldown}s` : "Send OTP"}
        </Button>

        {otpRequested && (
          <Button fullWidth sx={{ mt: 1 }} onClick={requestOtp} disabled={loading || otpCooldown > 0}>
            {otpCooldown > 0 ? `Resend OTP in ${otpCooldown}s` : "Resend OTP"}
          </Button>
        )}
      </form>
    </Box>
  );
}
