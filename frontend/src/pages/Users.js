import { useEffect, useState } from "react";
import api from "../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  MenuItem,
  TextField,
  Stack,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  Paper,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/users");
      const withEditableRole = res.data.map((u) => ({
        ...u,
        editableRole: u.role
      }));
      setUsers(withEditableRole);
    } catch {
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const saveRole = async (id, role) => {
    try {
      await api.put(`/auth/users/${id}/role`, { role });
      fetchUsers();
    } catch {
      alert("Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />;
      case "user":
        return <PersonIcon sx={{ fontSize: 20 }} />;
      case "viewer":
        return <VisibilityIcon sx={{ fontSize: 20 }} />;
      default:
        return <PersonIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return { bg: "#ffeef1", text: "#b01837" };
      case "user":
        return { bg: "#e8f2ff", text: "#1f5ea8" };
      case "viewer":
        return { bg: "#f3ecff", text: "#5d3ea8" };
      default:
        return { bg: "#f5f5f5", text: "#666" };
    }
  };

  const getAvatarColor = (name) => {
    const colors = ["#184e77", "#1f7a8c", "#2a9d8f", "#5f0f40", "#8d0801"];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(24,29,36,0.72), rgba(24,29,36,0.72)), url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.75)", letterSpacing: 2, fontWeight: 700 }}>
          Administration
        </Typography>
        <Typography variant="h3" fontWeight="bold" mb={1} sx={{ color: "#fff" }}>
          Manage Users
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "1.05rem" }}>
          Assign roles and manage user access
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <CircularProgress sx={{ color: "#fff" }} size={50} />
        </Box>
      ) : users.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3} alignItems="stretch">
          {users.map((u) => {
            const roleChanged = u.editableRole !== u.role;
            const isSelf = u._id === currentUser._id;
            const roleColor = getRoleColor(u.role);

            return (
              <Grid item xs={12} sm={6} lg={4} key={u._id} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    width: "100%",
                    minHeight: 420,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.94)",
                    backdropFilter: "blur(8px)",
                    boxShadow: isSelf
                      ? "0 20px 45px rgba(0,0,0,0.30), 0 0 0 2px #f4c542"
                      : "0 12px 30px rgba(0,0,0,0.22)",
                    transition: "all .25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)"
                    }
                  }}
                >
                  <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2.5 }}>
                    <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          background: getAvatarColor(u.name),
                          fontWeight: 700
                        }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight="bold" variant="h6" sx={{ mb: 0.25 }}>
                          {u.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", wordBreak: "break-word" }}>
                          {u.email}
                        </Typography>
                        {isSelf && (
                          <Chip label="Current Account" size="small" sx={{ mt: 1 }} />
                        )}
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                        Current Role
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          icon={getRoleIcon(u.role)}
                          label={u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          sx={{
                            background: roleColor.bg,
                            color: roleColor.text,
                            fontWeight: 700
                          }}
                        />
                      </Box>
                    </Box>

                    {!isSelf && (
                      <>
                        <TextField
                          select
                          fullWidth
                          label="Change Role"
                          value={u.editableRole}
                          size="small"
                          onChange={(e) =>
                            setUsers((prev) =>
                              prev.map((x) =>
                                x._id === u._id
                                  ? { ...x, editableRole: e.target.value }
                                  : x
                              )
                            )
                          }
                          sx={{ mb: 2 }}
                        >
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="user">User</MenuItem>
                          <MenuItem value="viewer">Viewer (Read Only)</MenuItem>
                        </TextField>

                        {roleChanged && (
                          <Alert severity="warning" sx={{ mb: 2 }}>
                            Role changes pending
                          </Alert>
                        )}
                      </>
                    )}

                    {isSelf && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        This is your account. You cannot modify your own role.
                      </Alert>
                    )}
                    </Box>

                    <Stack direction={{ xs: "column", sm: "row" }} gap={1} sx={{ mt: 1 }}>
                      {!isSelf && (
                        <Tooltip title={roleChanged ? "Save changes" : "No changes to save"}>
                          <span style={{ width: "100%" }}>
                            <Button
                              variant="contained"
                              endIcon={<SaveIcon />}
                              disabled={!roleChanged}
                              onClick={() => saveRole(u._id, u.editableRole)}
                              fullWidth
                              size="small"
                              sx={{ textTransform: "none", fontWeight: 700 }}
                            >
                              Save
                            </Button>
                          </span>
                        </Tooltip>
                      )}

                      <Tooltip title={isSelf ? "Cannot delete your own account" : "Delete user"}>
                        <span style={{ width: "100%" }}>
                          <Button
                            variant="outlined"
                            color="error"
                            endIcon={<DeleteIcon />}
                            disabled={isSelf}
                            onClick={() => deleteUser(u._id)}
                            fullWidth
                            size="small"
                            sx={{ textTransform: "none", fontWeight: 700 }}
                          >
                            Delete
                          </Button>
                        </span>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
