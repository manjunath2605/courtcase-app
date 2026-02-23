import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GavelIcon from "@mui/icons-material/Gavel";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";

export default function Navbar() {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));
  const isLoggedIn = Boolean(user);

  const role = user?.role;
  const isAdmin = role === "admin";
  const canEdit = role === "admin" || role === "user";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const navButtonSx = {
    color: "#0b1c39",
    fontWeight: 600,
    borderRadius: 99,
    px: 1.8,
    textTransform: "none",
    "&:hover": {
      backgroundColor: "rgba(11,28,57,0.08)"
    }
  };

  const goToSection = (sectionId) => {
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Clear local session state even if server logout fails.
    }
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  /* ======================
     Mobile Drawer
  ====================== */
  const drawerContent = (
    <Box sx={{ width: 280, background: "linear-gradient(180deg, #f7fbff 0%, #eef5ff 100%)", height: "100%" }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {/* Public */}
        <ListItem>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component={Link} to="/aboutus">
            <ListItemText primary="About Us" />
          </ListItemButton>
        </ListItem>
        <ListItemButton onClick={() => goToSection("services")}>
          <ListItemText primary="Services" />
        </ListItemButton>

        <ListItemButton onClick={() => goToSection("contact")}>
          <ListItemText primary="Contact Us" />
        </ListItemButton>

        <ListItemButton onClick={() => goToSection("gallery")}>
          <ListItemText primary="Gallery" />
        </ListItemButton>
        <Divider />

        {!isLoggedIn ? (
          <>
            <ListItem>
              <ListItemButton onClick={() => navigate("/login")}>
                <ListItemText primary="Staff Login" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate("/client-login")}>
                <ListItemText primary="Client Login" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem>
              <ListItemButton onClick={() => navigate("/dashboard")}>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            {canEdit && (
              <ListItem>
                <ListItemButton onClick={() => navigate("/cases/new")}>
                  <ListItemText primary="Add Case" />
                </ListItemButton>
              </ListItem>
            )}

            {isAdmin && (
              <>
                <Divider />
                <ListItem>
                  <ListItemButton onClick={() => navigate("/users")}>
                    <ListItemText primary="Manage Users" />
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton onClick={() => navigate("/register")}>
                    <ListItemText primary="Add User" />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            <Divider />
            <ListItem>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(11,28,57,0.08)",
          color: "#0b1c39",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 72 }}>
          {/* Logo */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #0f4f78 0%, #1d7a73 100%)",
                color: "#fff"
              }}
            >
              <GavelIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
              SVPJ
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1.2, alignItems: "center" }}>
            <Button component={Link} to="/" sx={navButtonSx}>Home</Button>
            <Button component={Link} to="/aboutus" sx={navButtonSx}>About Us</Button>
            <Button onClick={() => goToSection("services")} sx={navButtonSx}>Our Services</Button>
            <Button onClick={() => goToSection("contact")} sx={navButtonSx}>Contact Us</Button>
            <Button onClick={() => goToSection("gallery")} sx={navButtonSx}>Gallery</Button>

            {!isLoggedIn ? (
              <>
                <Button variant="contained" onClick={() => navigate("/login")} sx={{ borderRadius: 99, textTransform: "none", fontWeight: 700, px: 2.2 }}>
                  Staff Login
                </Button>
                <Button variant="outlined" onClick={() => navigate("/client-login")} sx={{ borderRadius: 99, textTransform: "none", fontWeight: 700, px: 2.2 }}>
                  Client Login
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/dashboard")} sx={navButtonSx}>
                  Dashboard
                </Button>

                {canEdit && (
                  <Button onClick={() => navigate("/cases/new")} sx={navButtonSx}>
                    Add Case
                  </Button>
                )}

                {isAdmin && (
                  <>
                    <Button onClick={() => navigate("/users")} sx={navButtonSx}>
                      Manage Users
                    </Button>
                    <Button onClick={() => navigate("/register")} sx={navButtonSx}>
                      Add User
                    </Button>
                  </>
                )}

                <Button color="error" onClick={handleLogout} sx={{ ...navButtonSx, bgcolor: "rgba(211,47,47,0.08)" }}>
                  Logout
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu */}
          <IconButton
            edge="end"
            sx={{ display: { xs: "block", md: "none" }, bgcolor: "rgba(11,28,57,0.08)" }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
}
