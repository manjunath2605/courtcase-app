import { Box, Button, Container, Grid, Typography } from "@mui/material";
import businessImage from "../../assets/business-meeting-office.jpg";
import { Link } from "react-router-dom";

export default function AboutSection() {
  return (
    <Box>
      <Container maxWidth={false} disableGutters>
        <Grid container>

          {/* LEFT CONTENT — FULL WIDTH BELOW md */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              minHeight: { xs: 380, sm: 450, md: 650 },
              backgroundColor: "#3f51ff",
              color: "#fff",
              px: { xs: 2.5, sm: 4, md: 10 },
              py: { xs: 4, sm: 6, md: 10 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: { xs: "100%", md: "50%" }, // 🔥 KEY FIX
            }}
          >
            <Typography variant="overline" sx={{ color: "#cfd8ff" }}>
              ABOUT OUR LAW AGENCY
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              mb={3}
              sx={{ fontSize: { xs: "1.6rem", sm: "2rem" } }}
            >
              We are committed for better service
            </Typography>

            <Typography sx={{ opacity: 0.9, mb: 2, lineHeight: 1.7 }}>
              Mollit anim laborum duis adseu dolor in voluptate velit ess cillum.
            </Typography>

            <Typography sx={{ opacity: 0.85, mb: 4, lineHeight: 1.7 }}>
              Mollit anim laborum. Dvcuis aute serunt iruxvfg dhjkolorh.
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0b1c39",
                width: "fit-content",
                px: 4,
                py: 1.5,
              }}
              component={Link} to="/aboutus"
            >
              LEARN ABOUT US
            </Button>
          </Grid>

          {/* RIGHT IMAGE — HIDDEN BELOW md */}
          <Grid
            item
            md={6}
            sx={{
              display: { xs: "none", md: "block" },
              minHeight: 650,
              position: "relative",
              width: "50%",
            }}
          >
            <Box
              component="img"
              src={businessImage}
              alt="Business Meeting Office"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "right center",
              }}
            />
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
