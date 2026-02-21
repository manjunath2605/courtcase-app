import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import HeroImage from "../../assets/heroimage.jpg";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box
        sx={{
          py: { xs: 8, sm: 10, md: 16 }, // responsive vertical spacing
          backgroundImage:
            "linear-gradient(rgba(247,249,255,0.9), rgba(247,249,255,0.9)), url(" + HeroImage + ")",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* FULL-WIDTH CONTAINER */}
        <Container maxWidth={false} disableGutters>
          {/* INNER CONTENT PADDING (CONTROLLED) */}
          <Box sx={{ px: { xs: 2.5, sm: 4, md: 10 } }}>
            <Typography variant="overline" color="primary">
              COMMITTED TO SUCCESS
            </Typography>

            <Typography
              fontWeight={700}
              mb={2}
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
             Legacy of Advocacy — The Sadarjoshi Tradition
            </Typography>
    <Typography
            mt={3}
            maxWidth={700}
            sx={{ opacity: 0.9, lineHeight: 1.7 }}
          >
        <strong>धर्मो रक्षति रक्षितः</strong> <br />
(Dharma protects those who protect it)
          </Typography>
          <br />
          <br />
            <Typography color="text.secondary" maxWidth={520} mb={4}>
              Professional legal help from experienced attorneys.
            </Typography>

            <Button variant="contained" component={Link} to="/aboutus">Learn About Us</Button>
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
}
