import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { Button, TextField, Box, Typography } from "@mui/material";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      alert("Password updated");
      navigate("/");
    } catch {
      setMsg("Invalid or expired token");
    }
  };

  return (
    <Box sx={{ width: 350, mx: "auto", mt: 10 }}>
      <Typography variant="h5">Reset Password</Typography>

      <TextField
        fullWidth
        type="password"
        label="New Password"
        margin="normal"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button variant="contained" fullWidth onClick={submit}>
        Reset Password
      </Button>

      {msg && <Typography color="error">{msg}</Typography>}
    </Box>
  );
}
