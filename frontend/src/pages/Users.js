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
            <Grid item xs={12} md={6} lg={4} key={u._id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  {/* USER INFO */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography fontWeight="bold">{u.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
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
                  <Stack direction="row" justifyContent="space-between" mt={3}>
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
