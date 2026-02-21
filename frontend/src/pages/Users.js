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
  IconButton,
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
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/users");
      const withEditableRole = res.data.map(u => ({
        ...u,
        editableRole: u.role
      }));
      setUsers(withEditableRole);
    } catch (error) {
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
    switch(role) {
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
    switch(role) {
      case "admin":
        return { bg: "#fee", text: "#c41c3b" };
      case "user":
        return { bg: "#e3f2fd", text: "#1976d2" };
      case "viewer":
        return { bg: "#f3e5f5", text: "#7b1fa2" };
      default:
        return { bg: "#f5f5f5", text: "#666" };
    }
  };

  const getAvatarColor = (name) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 }, 
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh"
    }}>
      {/* PAGE HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" mb={1} sx={{ color: "#fff" }}>
          👥 Manage Users
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem" }}>
          Assign roles and manage user access
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <CircularProgress sx={{ color: "#fff" }} size={50} />
        </Box>
      ) : users.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: "12px" }}>
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {users.map((u) => {
            const roleChanged = u.editableRole !== u.role;
            const isSelf = u._id === currentUser._id;
            const roleColor = getRoleColor(u.role);

            return (
              <Grid item xs={12} sm={6} lg={4} key={u._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "16px",
                    boxShadow: isSelf 
                      ? "0 20px 40px rgba(0,0,0,0.3), 0 0 0 3px #fff, 0 0 20px rgba(255,215,0,0.5)" 
                      : "0 10px 30px rgba(0,0,0,0.2)",
                    border: isSelf ? "3px solid #FFD700" : "none",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
                    },
                    "&::before": isSelf ? {
                      content: "'👤 YOU'",
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#FFD700",
                      color: "#000",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      zIndex: 1
                    } : {}
                  }}
                >
                  <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", pt: 3 }}>
                    {/* USER HEADER */}
                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          background: getAvatarColor(u.name),
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          cursor: "pointer"
                        }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight="bold" variant="h6" sx={{ mb: 0.5 }}>
                          {u.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "text.secondary",
                            wordBreak: "break-word",
                            fontSize: "0.9rem"
                          }}
                        >
                          {u.email}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* CURRENT ROLE BADGE */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "600" }}>
                        CURRENT ROLE
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          icon={getRoleIcon(u.role)}
                          label={u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          sx={{
                            background: roleColor.bg,
                            color: roleColor.text,
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            height: "32px"
                          }}
                        />
                      </Box>
                    </Box>

                    {/* ROLE SELECTOR */}
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
                          sx={{ 
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px"
                            }
                          }}
                        >
                          <MenuItem value="admin">👑 Admin</MenuItem>
                          <MenuItem value="user">👤 User</MenuItem>
                          <MenuItem value="viewer">👁️ Viewer (Read Only)</MenuItem>
                        </TextField>

                        {roleChanged && (
                          <Alert severity="warning" sx={{ mb: 2, borderRadius: "10px" }}>
                            <Typography variant="body2">
                              ⚠️ Role changes pending
                            </Typography>
                          </Alert>
                        )}
                      </>
                    )}

                    {/* INFO MESSAGE FOR SELF */}
                    {isSelf && (
                      <Alert 
                        severity="info" 
                        sx={{ 
                          mb: 2, 
                          borderRadius: "10px",
                          background: "rgba(25, 118, 210, 0.1)",
                          border: "1px solid #1976d2"
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: "500" }}>
                          🔒 This is your account. You cannot modify your own role.
                        </Typography>
                      </Alert>
                    )}

                    {/* ACTIONS */}
                    <Stack direction="row" gap={1} sx={{ mt: "auto" }}>
                      {!isSelf && (
                        <Tooltip title={roleChanged ? "Save changes" : "No changes to save"}>
                          <span style={{ flex: 1 }}>
                            <Button
                              variant="contained"
                              endIcon={<SaveIcon />}
                              disabled={!roleChanged}
                              onClick={() => saveRole(u._id, u.editableRole)}
                              fullWidth
                              size="small"
                              sx={{
                                borderRadius: "10px",
                                textTransform: "none",
                                fontWeight: "600",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)"
                                }
                              }}
                            >
                              Save
                            </Button>
                          </span>
                        </Tooltip>
                      )}

                      <Tooltip title={isSelf ? "Cannot delete your own account" : "Delete user"}>
                        <span style={{ flex: 1 }}>
                          <Button
                            variant="outlined"
                            color="error"
                            endIcon={<DeleteIcon />}
                            disabled={isSelf}
                            onClick={() => deleteUser(u._id)}
                            fullWidth
                            size="small"
                            sx={{
                              borderRadius: "10px",
                              textTransform: "none",
                              fontWeight: "600"
                            }}
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