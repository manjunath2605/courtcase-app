import { useEffect, useState } from "react";
import { Box, Button, Container, IconButton, Stack, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HeroImage from "../../assets/heroimage.jpg";
import OfficeImage from "../../assets/office.jpeg";
import MeetingImage from "../../assets/3gen.jpeg";

const HERO_SLIDES = [
  {
    image: HeroImage,
    title: "Legacy of Advocacy - The Sadarjoshi Tradition",
    subtitle: "Professional legal help from experienced attorneys.",
    motto: "धर्मो रक्षति रक्षितः",
    mottoMeaning: "(Dharma protects those who protect it)",
  },
  {
    image: OfficeImage,
    title: "Trusted Counsel Across Generations",
    subtitle: "Strategic legal representation for civil and criminal matters.",
    motto: "सत्यमेव जयते",
    mottoMeaning: "(Truth alone triumphs)",
  },
  {
    image: MeetingImage,
    title: "Focused on Results, Grounded in Values",
    subtitle: "Practical legal guidance with transparent client communication.",
    motto: "न्याय मुला सूरज्या",
    mottoMeaning: "(Good governance is rooted in justice)",
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 460, md: 560 },
          py: { xs: 8, sm: 10, md: 16 },
        }}
      >
        <AnimatePresence mode="wait">
          <Box
            key={HERO_SLIDES[activeIndex].image}
            component={motion.div}
            initial={{ opacity: 0.35, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.35, scale: 1.01 }}
            transition={{ duration: 0.7 }}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(247,249,255,0.86), rgba(247,249,255,0.88)), url(" +
                HERO_SLIDES[activeIndex].image +
                ")",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>

        <Container maxWidth={false} disableGutters sx={{ position: "relative", zIndex: 2 }}>
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
              {HERO_SLIDES[activeIndex].title}
            </Typography>

            <Typography mt={3} maxWidth={700} sx={{ opacity: 0.9, lineHeight: 1.7 }}>
              <strong>{HERO_SLIDES[activeIndex].motto}</strong> <br />
              {HERO_SLIDES[activeIndex].mottoMeaning}
            </Typography>

            <Box sx={{ height: 24 }} />

            <Typography color="text.secondary" maxWidth={520} mb={4}>
              {HERO_SLIDES[activeIndex].subtitle}
            </Typography>

            <Button variant="contained" component={Link} to="/aboutus">
              Learn About Us
            </Button>
          </Box>
        </Container>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            left: { xs: 16, md: 40 },
            bottom: { xs: 16, md: 24 },
            zIndex: 3,
          }}
        >
          {HERO_SLIDES.map((_, idx) => (
            <Box
              key={idx}
              onClick={() => setActiveIndex(idx)}
              sx={{
                width: idx === activeIndex ? 24 : 10,
                height: 10,
                borderRadius: 999,
                bgcolor: idx === activeIndex ? "primary.main" : "rgba(0,0,0,0.25)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </Stack>

        <IconButton
          onClick={prevSlide}
          sx={{
            position: "absolute",
            left: { xs: 8, md: 20 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.72)",
            zIndex: 3,
            "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
          }}
          aria-label="Previous slide"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <IconButton
          onClick={nextSlide}
          sx={{
            position: "absolute",
            right: { xs: 8, md: 20 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.72)",
            zIndex: 3,
            "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
          }}
          aria-label="Next slide"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </motion.div>
  );
}
