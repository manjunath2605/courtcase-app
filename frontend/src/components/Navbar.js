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
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isLoggedIn = Boolean(token && user);

  const role = user?.role;
  const isAdmin = role === "admin";
  const canEdit = role === "admin" || role === "user";

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  /* ======================
     Drawer (Mobile)
  ====================== */
  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {isLoggedIn && (
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
      <AppBar position="sticky">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ cursor: "pointer" }}
            onClick={() => isLoggedIn && navigate("/dashboard")}
          >
            Court Case App
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
            {isLoggedIn && (
              <>
                <Button color="inherit" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>

                {canEdit && (
                  <Button color="inherit" onClick={() => navigate("/cases/new")}>
                    Add Case
                  </Button>
                )}

                {isAdmin && (
                  <>
                    <Button color="inherit" onClick={() => navigate("/users")}>
                      Manage Users
                    </Button>
                    <Button
                      color="inherit"
                      onClick={() => navigate("/register")}
                    >
                      Add User
                    </Button>
                  </>
                )}

                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Hamburger */}
          {isLoggedIn && (
            <IconButton
              color="inherit"
              edge="end"
              sx={{ display: { xs: "block", sm: "none" } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
}
