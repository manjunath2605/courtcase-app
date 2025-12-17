import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

export default function AboutUs() {
  return (
    <>
      {/* ================= HERO ================= */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0b1c39, #1e3c72)",
          color: "#fff",
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ opacity: 0.8 }}>
            About Us
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            mt={1}
            sx={{ fontSize: { xs: "1.9rem", md: "2.8rem" } }}
          >
            Trusted Legal Partners for Justice
          </Typography>

          <Typography
            mt={3}
            maxWidth={700}
            sx={{ opacity: 0.9, lineHeight: 1.7 }}
          >
            We provide ethical, transparent, and result-oriented legal solutions
            tailored to individual and corporate needs.
          </Typography>
        </Container>
      </Box>

      {/* ================= WHO WE ARE ================= */}
      <Container maxWidth="lg" sx={{ my: { xs: 6, md: 10 } }}>
        <Grid
          container
          spacing={6}
          alignItems="stretch"   // ✅ FIX
        >
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} mb={3}>
              Who We Are
            </Typography>

            <Typography color="text.secondary" lineHeight={1.8}>
              Our firm consists of experienced advocates and legal consultants
              committed to excellence, integrity, and justice.
            </Typography>

            <Typography color="text.secondary" lineHeight={1.8} mt={2}>
              We believe every client deserves clarity, strategy, and strong
              representation.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",            // ✅ prevents overlap
                p: 4,
                borderRadius: 3,
                backgroundColor: "#f8f9fc",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Our Core Values
                </Typography>

                {[
                  "Integrity & Transparency",
                  "Client-Centric Approach",
                  "Legal Excellence",
                  "Commitment to Justice",
                ].map((item, i) => (
                  <Typography
                    key={i}
                    color="text.secondary"
                    mb={1}
                  >
                    • {item}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* ================= STATS ================= */}
      <Box sx={{ backgroundColor: "#f5f7fb", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              { label: "Years of Experience", value: "15+" },
              { label: "Cases Handled", value: "1200+" },
              { label: "Success Rate", value: "95%" },
              { label: "Trusted Clients", value: "500+" },
            ].map((item, index) => (
              <Grid item xs={6} md={3} key={index} textAlign="center">
                <Typography variant="h4" fontWeight={700} color="primary">
                  {item.value}
                </Typography>
                <Typography color="text.secondary">
                  {item.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ================= WHY CHOOSE US ================= */}
      <Container maxWidth="lg" sx={{ my: { xs: 6, md: 10 } }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          mb={6}
        >
          Why Choose Us
        </Typography>

        <Grid
          container
          spacing={4} 
          justifyContent="center"           // ✅ vertical + horizontal gap
          alignItems="stretch"   // ✅ equal height cards
          rowSpacing={10}         // ✅ vertical gap on small screens
        >
          {[
            {
              title: "Experienced Advocates",
              desc: "Strong courtroom expertise and strategic thinking.",
            },
            {
              title: "Personal Attention",
              desc: "Each case is handled with focus and confidentiality.",
            },
            {
              title: "Transparent Process",
              desc: "Clear communication at every legal stage.",
            },
            {
              title: "Result Driven",
              desc: "Focused on outcomes that protect your rights.",
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  width: { xs: "100%", sm: "240px", md: "360px" },
                  height: "100%",           // ✅ FIX
                  p: 3,
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Typography variant="h6" fontWeight={600} mb={1}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary" lineHeight={1.7}>
                  {item.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ================= CTA ================= */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3c72, #2a5298)",
          color: "#fff",
          py: { xs: 6, md: 8 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} mb={2}>
            Need Legal Assistance?
          </Typography>
          <Typography sx={{ opacity: 0.9 }}>
            Get expert legal guidance from professionals you can trust.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
