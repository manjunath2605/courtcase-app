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
  Divider
} from "@mui/material";

export default function Users() {
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = async () => {
    const res = await api.get("/auth/users");
    // add local editableRole state
    const withEditableRole = res.data.map(u => ({
      ...u,
      editableRole: u.role
    }));
    setUsers(withEditableRole);
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
    await api.delete(`/auth/users/${id}`);
    fetchUsers();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* PAGE HEADER */}
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Manage Users
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Assign roles and manage user access
      </Typography>

      <Grid container spacing={3}>
        {users.map((u) => {
          const roleChanged = u.editableRole !== u.role;
          const isSelf = u._id === currentUser.id;

          return (
            <Grid item xs={12} sm={6} md={4} key={u._id}>
              <Card sx={{ width: 320, height: 300, mx: 'auto', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* USER INFO */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
                        {u.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                        {u.email}
                      </Typography>
                    </Box>

                    <Chip
                      label={u.role.toUpperCase()}
                      color={
                        u.role === "admin"
                          ? "error"
                          : u.role === "user"
                          ? "primary"
                          : "default"
                      }
                      size="small"
                    />
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* ROLE SELECT */}
                  <TextField
                    select
                    fullWidth
                    label="Change Role"
                    value={u.editableRole}
                    disabled={isSelf}
                    onChange={(e) =>
                      setUsers((prev) =>
                        prev.map((x) =>
                          x._id === u._id
                            ? { ...x, editableRole: e.target.value }
                            : x
                        )
                      )
                    }
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="viewer">Viewer (Read Only)</MenuItem>
                  </TextField>

                  {/* ACTIONS */}
                  <Stack direction="row" justifyContent="space-between" mt={3} sx={{ mt: 'auto' }}>
                    <Button
                      variant="contained"
                      disabled={!roleChanged || isSelf}
                      onClick={() => saveRole(u._id, u.editableRole)}
                    >
                      Save
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      disabled={isSelf}
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </Button>
                  </Stack>

                  {isSelf && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={1}
                      sx={{ wordBreak: 'break-word' }}
                    >
                      You cannot modify your own role
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}