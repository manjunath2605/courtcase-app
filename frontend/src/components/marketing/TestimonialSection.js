import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

const testimonials = [
  {
    name: "Oliva Jems",
    role: "Chief Lawyer",
    text:
      "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Mark Hill",
    role: "Client",
    text:
      "Professional legal support with excellent communication and results.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah John",
    role: "Client",
    text:
      "Highly recommended law firm. They handled my case with care and precision.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);

  // Auto rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        backgroundImage:
          "linear-gradient(rgba(11,28,57,0.95), rgba(11,28,57,0.95)), url(https://images.unsplash.com/photo-1521791055366-0d553872125f)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        textAlign: "center",
      }}
    >
      {/* SECTION HEADING */}
      <Typography
        variant="overline"
        sx={{ color: "#cfd8ff", letterSpacing: 1 }}
      >
        TESTIMONIALS
      </Typography>

      <Typography
        fontWeight={700}
        mb={6}
        sx={{
          fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
        }}
      >
        What Our Clients Say
      </Typography>

      {/* TESTIMONIAL ANIMATION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Quote */}
          <Typography
            sx={{
              maxWidth: 720,
              mx: "auto",
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            “{testimonials[index].text}”
          </Typography>

          {/* Avatar */}
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              mx: "auto",
              mb: 2,
              backgroundImage: `url(${testimonials[index].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "3px solid rgba(255,255,255,0.3)",
            }}
          />

          {/* Name */}
          <Typography fontWeight={600}>
            {testimonials[index].name}
          </Typography>

          {/* Role */}
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            {testimonials[index].role}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
