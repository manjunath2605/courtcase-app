import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{
      mt: "auto",
      py: 2,
      textAlign: "center",
      bgcolor: "primary.main",
      color: "white",
    }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} Court Case Management. All rights reserved.
      </Typography>
    </Box>
  );
}
