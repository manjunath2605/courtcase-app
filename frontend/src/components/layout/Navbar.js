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
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = Boolean(token && user);

  const role = user?.role;
  const isAdmin = role === "admin";
  const canEdit = role === "admin" || role === "user";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  /* ======================
     Mobile Drawer
  ====================== */
  const drawerContent = (
    <Box sx={{ width: 260 }} role="presentation" onClick={toggleDrawer(false)}>
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
        <ListItemButton
          onClick={() => {
            if (window.location.pathname !== "/") {
              navigate("/", { state: { scrollTo: "services" } });
            } else {
              document
                .getElementById("services")
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <ListItemText primary="Services" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            if (window.location.pathname !== "/") {
              navigate("/", { state: { scrollTo: "contact" } });
            } else {
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <ListItemText primary="Contact Us" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            if (window.location.pathname !== "/") {
              navigate("/", { state: { scrollTo: "gallery" } });
            } else {
              document
                .getElementById("gallery")
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <ListItemText primary="Gallery" />
        </ListItemButton>
        <Divider />

        {!isLoggedIn ? (
          <ListItem>
            <ListItemButton onClick={() => navigate("/login")}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
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
          backgroundColor: "#fff",
          borderBottom: "1px solid #eee",
          color: "#0b1c39",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
          >
            SVPJ
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button component={Link} to="/">Home</Button>
            <Button component={Link} to="/aboutus">About US</Button>
            <Button
              onClick={() => {
                if (window.location.pathname !== "/") {
                  navigate("/", { state: { scrollTo: "services" } });
                } else {
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >Our Services</Button>
            <Button
              onClick={() => {
                if (window.location.pathname !== "/") {
                  navigate("/", { state: { scrollTo: "contact" } });
                } else {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >Contact Us</Button>
            <Button
              onClick={() => {
                if (window.location.pathname !== "/") {
                  navigate("/", { state: { scrollTo: "gallery" } });
                } else {
                  document
                    .getElementById("gallery")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >Gallery</Button>

            {!isLoggedIn ? (
              <Button variant="contained" onClick={() => navigate("/login")}>
                Login
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>

                {canEdit && (
                  <Button onClick={() => navigate("/cases/new")}>
                    Add Case
                  </Button>
                )}

                {isAdmin && (
                  <>
                    <Button onClick={() => navigate("/users")}>
                      Manage Users
                    </Button>
                    <Button onClick={() => navigate("/register")}>
                      Add User
                    </Button>
                  </>
                )}

                <Button color="error" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu */}
          <IconButton
            edge="end"
            sx={{ display: { xs: "block", md: "none" } }}
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
