import { Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      sx={{
        mt: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        background:
          "linear-gradient(120deg, #0b1c39 0%, #123a63 45%, #0f5a57 100%)",
        color: "#fff",
        borderTop: "1px solid rgba(255,255,255,0.15)"
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        sx={{ maxWidth: 1200, mx: "auto" }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.4 }}>
            SVPJ
          </Typography>
          {/* <Typography variant="body2" sx={{ opacity: 0.82 }}>
            Court case management and client updates.
          </Typography> */}
        </Box>

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Typography component={Link} to="/" sx={linkSx}>
            Home
          </Typography>
          <Typography component={Link} to="/aboutus" sx={linkSx}>
            About
          </Typography>
          <Typography component={Link} to="/login" sx={linkSx}>
            Staff Login
          </Typography>
          <Typography component={Link} to="/client-login" sx={linkSx}>
            Client Login
          </Typography>
        </Stack>
      </Stack>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 2.5,
          textAlign: { xs: "left", md: "center" },
          opacity: 0.78
        }}
      >
        Copyright {new Date().getFullYear()} SVPJ. All rights reserved.
      </Typography>
    </Box>
  );
}

const linkSx = {
  color: "rgba(255,255,255,0.88)",
  textDecoration: "none",
  fontSize: "0.9rem",
  "&:hover": {
    color: "#fff",
    textDecoration: "underline"
  }
};
