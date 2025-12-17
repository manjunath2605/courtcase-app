import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Dialog,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/* ================= GALLERY DATA ================= */

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1528747045269-390fe33c19f2",
    title: "Court Proceedings",
  },
  {
    src: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb",
    title: "Legal Consultation",
  },

  {
    src: "https://images.unsplash.com/photo-1555375771-14b2a63968a9",
    title: "Client Meeting",
  },
  {
    src: "https://images.unsplash.com/photo-1603575448878-868a20723f5d",
    title: "Legal Documents",
  },
  {
    src: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    title: "Justice & Law",
  },
];

/* ================= COMPONENT ================= */

export default function GallerySection() {
  const [open, setOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const handleOpen = (img) => {
    setActiveImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveImage(null);
  };

  return (
    <Container maxWidth="lg" sx={{ my: "50px" }} id="gallery">
      {/* Heading */}
      <Box mb={{ xs: 4, md: 6 }}>
        <Typography
          variant="overline"
          color="primary"
          sx={{ letterSpacing: 1 }}
        >
          Gallery
        </Typography>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ fontSize: { xs: "1.8rem", sm: "2.2rem" } }}
        >
          Moments From Our Legal Journey
        </Typography>
      </Box>

      {/* Gallery Grid */}
      <Grid container spacing={4}>
        {GALLERY_IMAGES.map((img, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              onClick={() => handleOpen(img)}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                height: 240,
                boxShadow: 3,
                transition: "all 0.35s ease",

                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 8,
                },

                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent, rgba(0,0,0,0.6))",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                },

                "&:hover::after": {
                  opacity: 1,
                },
              }}
            >
              <Box
                component="img"
                src={img.src}
                alt={img.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Caption */}
              <Typography
                variant="subtitle1"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  color: "#fff",
                  zIndex: 2,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  ".MuiBox-root:hover &": {
                    opacity: 1,
                  },
                }}
              >
                {img.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Preview Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <Box sx={{ position: "relative", bgcolor: "#000" }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#fff",
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>

          {activeImage && (
            <Box
              component="img"
              src={activeImage.src}
              alt={activeImage.title}
              sx={{
                width: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </Dialog>
    </Container>
  );
}
