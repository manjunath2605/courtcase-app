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
              For nearly a century, the Sadarjoshi family of Chikodi has stood as a symbol of
honour, scholarship, and unwavering commitment to the noble profession of advocacy.
Since 1935, the family’s name has been associated with integrity, principled
representation, and service to justice — a legacy shaped by tradition and professional
excellence.
            </Typography>

            <Typography color="text.secondary" lineHeight={1.8} mt={2}>
             This distinguished journey commenced under the guidance of Shri Vamanrao
Hanumantrao Sadarjoshi, whose formidable presence at the Bar and remarkable
command over criminal law established a practice of exceptional repute. Through
fearless advocacy, intellectual rigour, and dedication to the rule of law, he earned
enduring respect within the legal fraternity and laid the foundation for a heritage that
continues to inspire.
            </Typography>
            <Typography color="text.secondary" lineHeight={1.8} mt={2}>
             The mantle of this tradition was carried forward by his youngest son, Shri
Sadguru Vamanrao Sadarjoshi, who further elevated the family’s standing through
decades of distinguished service. A practitioner of refined understanding and disciplined
scholarship, he achieved notable mastery in civil law. His stewardship preserved the
ideals of his predecessor while enriching the legacy with wisdom, depth, and
professional distinction.
            </Typography>
            <Typography color="text.secondary" lineHeight={1.8} mt={2}>
Today, this venerable lineage continues through Preeti Sadguru Sadarjoshi and
Prasad Sadguru Sadarjoshi, who uphold these enduring values with dedication and
responsibility. Rooted in honour and guided by the ideals of justice, they carry forward a
tradition built upon trust, knowledge, and advocacy of the highest order.
            </Typography>
            
                     <Typography variant="h4" fontWeight={700} mb={1} mt={10}>
              Our Motto
            </Typography>
            <Typography variant="h6" fontWeight={600}  >
             सत्यमेव जयते

            </Typography>
            <Typography color="text.secondary" lineHeight={1.8} mb={3}>
             (Truth alone triumphs)
            </Typography>
                        <Typography color="text.secondary" lineHeight={1.8} mt={2}>
To render legal counsel and services of the highest quality across diverse fields
of law, ensuring that justice is accessible and meaningful to those in need. Alongside
professional service, we remain devoted to guiding and nurturing the next generation of
advocates, encouraging them to cultivate excellence, discipline, and mastery in the
practice of law.
            </Typography>

                               <Typography variant="h4" fontWeight={700} mb={1} mt={10}>
              Our Ambition
            </Typography>
            <Typography variant="h6" fontWeight={600}  >
            न्यायो धर्मस्य मूलम्

            </Typography>
            <Typography color="text.secondary" lineHeight={1.8} mb={3}>
             (Justice is the foundation of righteousness)
            </Typography>
                        <Typography color="text.secondary" lineHeight={1.8} mt={2}>
Our aspiration is to attain distinction through a justice-centred approach
grounded in integrity, scholarship, and responsibility. We strive to contribute to society
by fostering a principled and capable community of advocates whose collective work
advances fairness, ethical practice, and social betterment.
            </Typography>


            
                               <Typography variant="h4" fontWeight={700} mb={1} mt={10}>
              Style of Work
            </Typography>
            <Typography variant="h6" fontWeight={600}  >
           योगः कर्मसु कौशलम्

            </Typography>
            <Typography color="text.secondary" lineHeight={1.8} mb={3}>
             (Excellence in action is true discipline)
            </Typography>
                        <Typography color="text.secondary" lineHeight={1.8} mt={2}>
Every matter entrusted to us is approached with personal attention and
thoughtful diligence. By carefully understanding the facts and context of each case, we
seek clarity, precision, and sound judgement — ensuring that our advocacy reflects
both professional excellence and sincere commitment to those we represent.
            </Typography>
             <Typography color="text.secondary" lineHeight={1.8} mt={2}>
Spanning generations, the Sadarjoshi legacy remains a testament to continuity of
purpose, nobility of profession, and steadfast devotion to justice — rooted in tradition,
active in the present, and committed to the future.
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
                  width: { xs: "180px", sm: "240px", md: "360px" },
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
