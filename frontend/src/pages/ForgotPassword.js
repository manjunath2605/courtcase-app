import { useState } from "react";
import api from "../api";
import { Button, TextField, Box, Typography } from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    try {
      await api.post("/auth/forgot-password", { email });
      setMsg("If the email exists, reset link has been sent.");
    } catch {
      setMsg("Something went wrong");
    }
  };

  return (
    <Box sx={{ width: 350, mx: "auto", mt: 10 }}>
      <Typography variant="h5">Forgot Password</Typography>

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button variant="contained" fullWidth onClick={submit}>
        Send Reset Link
      </Button>

      {msg && <Typography sx={{ mt: 2 }}>{msg}</Typography>}
    </Box>
  );
}
