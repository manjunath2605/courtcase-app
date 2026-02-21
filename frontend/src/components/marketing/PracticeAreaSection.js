import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

/* ================= PRACTICE AREAS DATA ================= */

const PRACTICE_AREAS = [
  {
    title: "Advisory & Consultation",
    icon: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
    bullets: [
      "Legal advice & opinions",
      "Risk assessment & compliance guidance",
      "Contract review & interpretation",
      "Legal due diligence",
    ],
  },
  {
    title: "Documentation & Drafting",
    icon: "https://cdn-icons-png.flaticon.com/512/942/942781.png",
    bullets: [
      "Contracts, agreements & legal notices",
      "Wills, trusts & estate documents",
      "Statements, petitions & written arguments",
      "Demand & termination notices",
    ],
  },
  {
    title: "Litigation & Court Representation",
    icon: "https://cdn-icons-png.flaticon.com/512/942/942799.png",
    bullets: [
      "Civil & criminal case representation",
      "Bail, trial & appeals",
      "Petitions in District, High & Supreme Courts",
      "Court appearances & hearings",
    ],
  },
  // {
  //   title: "Corporate & Commercial Law",
  //   icon: "https://cdn-icons-png.flaticon.com/512/942/942833.png",
  //   bullets: [
  //     "Company formation & registration",
  //     "Corporate governance & compliance",
  //     "Shareholder agreements & MOUs",
  //     "Mergers, acquisitions & restructuring",
  //   ],
  // },
  {
    title: "Family Law",
    icon: "https://cdn-icons-png.flaticon.com/512/942/942806.png",
    bullets: [
      "Divorce & separation",
      "Child custody & maintenance",
      "Adoption procedures",
      "Domestic violence & alimony matters",
    ],
  },
  {
    title: "Property & Real Estate Law",
    icon: "https://cdn-icons-png.flaticon.com/512/942/942841.png",
    bullets: [
      "Sale & purchase agreements",
      "Title verification & due diligence",
      "Property dispute resolution",
      "Lease & tenancy matters",
    ],
  },
  // {
  //   title: "Employment & Labor Law",
  //   icon: "https://cdn-icons-png.flaticon.com/512/942/942819.png",
  //   bullets: [
  //     "Employment contract drafting",
  //     "Employer & employee advisory",
  //     "Wrongful dismissal cases",
  //     "Labor dispute representation",
  //   ],
  // },
  // {
  //   title: "Intellectual Property Law",
  //   icon: "https://cdn-icons-png.flaticon.com/512/942/942848.png",
  //   bullets: [
  //     "Trademark & copyright registration",
  //     "Patent filing & prosecution",
  //     "IP licensing agreements",
  //     "Infringement & enforcement actions",
  //   ],
  // },
  // {
  //   title: "Regulatory, Tax & Compliance",
  //   icon: "https://cdn-icons-png.flaticon.com/512/942/942853.png",
  //   bullets: [
  //     "GST & tax advisory",
  //     "Regulatory filings & notices",
  //     "Corporate tax compliance",
  //     "Licenses & permits",
  //   ],
  // },
];

/* ================= COMPONENT ================= */

export default function PracticeAreaSection() {
  return (
    <Container
      id="services" 
      maxWidth="lg"
      disableGutters
      sx={{
        my: "50px",              // ✅ margin top & bottom
      }}
    >
      {/* Inner padding */}
      <Box sx={{ px: { xs: 2.5, md: 0 } }}>
        {/* Heading */}
        <Typography
          variant="overline"
          color="primary"
          sx={{ letterSpacing: 1 }}
        >
          Our Practicing Area
        </Typography>

        <Typography
          variant="h4"
          fontWeight={700}
          mb={{ xs: 4, md: 6 }}
          sx={{ fontSize: { xs: "1.8rem", sm: "2.2rem" } }}
        >
          Area Of Practice That Can Help You Win
        </Typography>

        {/* Cards */}
        <Grid
          container
          columnSpacing={4}
          rowSpacing={4}
          alignItems="stretch"
        >
          {PRACTICE_AREAS.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                variant="outlined"
                sx={{
                  width: { xs: "100%", sm: "240px", md: "260px" },
                  maxWidth: "260px",
                  height: "300px",
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.35s ease",

                  /* ===== Overlay ===== */
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(25,118,210,0.9), rgba(13,71,161,0.9))",
                    opacity: 0,
                    transition: "opacity 0.35s ease",
                    zIndex: 1,
                  },

                  "&:hover::before": {
                    opacity: 1,
                  },

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 0,
                    position: "relative",
                    zIndex: 2,              // ✅ ABOVE overlay
                    transition: "color 0.3s ease",

                    /* ===== Text turns white on hover ===== */
                    ".MuiCard-root:hover &": {
                      color: "#fff",
                    },
                  }}
                >

                  {/* Icon */}
                  <Box mb={3}>
                    <img
                      src={item.icon}
                      alt={item.title}
                      width={48}
                      height={48}
                    />
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={2}
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* Bullets */}
                  <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                    {item.bullets.map((point, i) => (
                      <Typography
                        component="li"
                        key={i}
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1.2,
                          lineHeight: 1.6,
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {point}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Box>
    </Container>
  );
}
