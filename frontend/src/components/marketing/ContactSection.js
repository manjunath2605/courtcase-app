import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert
} from "@mui/material";
import api from "../../api";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.message) {
      setStatus({ type: "error", text: "Please fill all fields." });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ type: "", text: "" });
      await api.post("/contact", form);
      setStatus({ type: "success", text: "Thanks. We received your details." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.msg || "Failed to submit details. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: "#fff" }}>
      {/* FULL WIDTH */}
      <Container maxWidth={false} disableGutters id="contact">
        <Grid container alignItems="stretch">
          
          {/* LEFT: MAP + INFO (5/12) */}
          <Grid
            item
            xs={12}
            md={7}
            sx={{ p: { xs: 3, md: 7 } }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {/* Info */}
              <Box>
                <Typography color="primary" fontWeight={600} mb={1}>
                  Reach us at
                </Typography>

                <Typography
                  color="text.secondary"
                  maxWidth={480}
                  mb={2}
                >
  

<strong>Head Office</strong><br />
SadguruPrem,
Indira Nagar,
Chikodi

<br /><br />
<strong>Nipani Office Address</strong><br />
Srivatsa,
Ground Floor
Omkar Apartment
Beside G.I Bagewadi College, Panade Colony Nipani
                </Typography>

                {/* <Stack direction="row" spacing={1}>
                  <IconButton color="primary"><TwitterIcon /></IconButton>
                  <IconButton color="primary"><FacebookIcon /></IconButton>
                  <IconButton color="primary"><GoogleIcon /></IconButton>
                  <IconButton color="primary"><InstagramIcon /></IconButton>
                </Stack> */}
              </Box>

              {/* Map */}
              <Box
                sx={{
                  flexGrow: 1,
                  minHeight: 360,
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                
             <iframe title="Chikodi Office Location Map" src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3827.002962417147!2d74.5769150769578!3d16.424675943845436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTbCsDI1JzI4LjgiTiA3NMKwMzQnNTQuNCJF!5e0!3m2!1sen!2sus!4v1765971833098!5m2!1sen!2sus" width="600" height="450" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT: FORM (7/12) — BIGGER */}
         {/* RIGHT: FORM (USES FULL AVAILABLE WIDTH) */}
<Grid
  item
  xs={12}
  md={5}
  sx={{
    p: { xs: 3, md: 5 },
    display: "flex",
  }}
>
  <Paper
    elevation={6}
    sx={{
      width: "35rem",        // 🔥 KEY
      maxWidth: "100%",     // 🔥 KEY
      height: "100%",
      p: { xs: 4, md: 6 },
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Typography
      fontWeight={700}
      mb={3}
      sx={{ fontSize: "1.7rem" }}
    >
      Get in Touch
    </Typography>

    <Stack spacing={3}>
      {status.text && <Alert severity={status.type || "info"}>{status.text}</Alert>}
      <TextField label="First Name" name="name" value={form.name} onChange={handleChange} fullWidth />
      <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
      <TextField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} fullWidth />
      <TextField
        label="What do you have in mind?"
        name="message"
        value={form.message}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
      />

      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={submitting}
        sx={{
          mt: 1,
          py: 1.6,
          borderRadius: 999,
          fontWeight: 600,
          textTransform: "none",
          fontSize: "1rem",
          px: 7,
          alignSelf: "flex-start",
        }}
      >
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </Stack>
  </Paper>
</Grid>


        </Grid>
      </Container>
    </Box>
  );
}
