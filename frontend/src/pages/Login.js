import { useEffect, useState } from "react";
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
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  useEffect(() => {
    if (otpCooldown <= 0) return undefined;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const requestSecureOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      await api.post("/auth/login/password/request-otp", form);
      setOtpRequested(true);
      setOtpCooldown(60);
      setInfo("OTP sent to your registered email.");
    } catch (err) {
      if (err.response?.status === 429) {
        const retryAfter = Number(err.response?.data?.retryAfter) || 60;
        setOtpCooldown(retryAfter);
        setError(`Please wait ${retryAfter}s before requesting OTP again.`);
      } else if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.response?.data?.msg || "Invalid username or password");
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
      const res = await api.post("/auth/login/verify-otp", {
        email: form.email,
        otp
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.removeItem("token");
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
      <Typography variant="h5" mb={2}>Secure Login</Typography>

      {error && <Typography color="error">{error}</Typography>}
      {info && <Typography color="primary" sx={{ mb: 1 }}>{info}</Typography>}

      <form onSubmit={otpRequested ? verifyOtp : requestSecureOtp}>
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          disabled={loading || otpRequested}
        />

        {!otpRequested ? (
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
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
        ) : (
          <TextField
            label="Enter OTP"
            name="otp"
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
          ) : otpRequested ? "Verify OTP" : otpCooldown > 0 ? `Try again in ${otpCooldown}s` : "Login & Send OTP"}
        </Button>

        {otpRequested && (
          <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={requestSecureOtp}
            disabled={loading || otpCooldown > 0}
          >
            {otpCooldown > 0 ? `Resend OTP in ${otpCooldown}s` : "Resend OTP"}
          </Button>
        )}

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
