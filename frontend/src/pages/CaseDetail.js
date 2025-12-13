import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  Chip,
  Divider,
  Stack
} from "@mui/material";

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  

  const user = JSON.parse(localStorage.getItem("user"));
const role = user?.role;

const isAdmin = role === "admin";
const isViewer = role === "viewer";


  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCase();
  }, []);

  const fetchCase = async () => {
    const res = await api.get(`/cases/${id}`);
    setCaseData(res.data);
    setLoading(false);
  };

  const updateCase = async () => {
    try {
      await api.put(`/cases/${id}`, caseData);
      alert("Case updated successfully");
      fetchCase();
    } catch (err) {
      console.error(err);
      alert("Failed to update case");
    }
  };

  const deleteCase = async () => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;

    try {
      await api.delete(`/cases/${id}`);
      alert("Case deleted successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to delete case");
    }
  };

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Card */}
      <Card sx={{ maxWidth: 900, mx: "auto", mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              Case No: {caseData.caseNo}
            </Typography>

            <Chip
              label={caseData.status}
              color={
                caseData.status === "Open"
                  ? "primary"
                  : caseData.status === "Closed"
                  ? "success"
                  : "warning"
              }
              sx={{ fontWeight: "bold" }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Edit Case Info */}
      <Card sx={{ maxWidth: 900, mx: "auto", borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Edit Case Info
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Case No */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Case No"
                value={caseData.caseNo}
                onChange={e => setCaseData({ ...caseData, caseNo: e.target.value })}
                disabled={isViewer}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Status"
                value={caseData.status}
                onChange={e => setCaseData({ ...caseData, status: e.target.value })}
                disabled={isViewer}
              />
            </Grid>

            {/* Court */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Court"
                value={caseData.court}
                onChange={e => setCaseData({ ...caseData, court: e.target.value })}
                disabled={isViewer}
              />
            </Grid>

            {/* Party Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Party Name"
                value={caseData.partyName}
                onChange={e => setCaseData({ ...caseData, partyName: e.target.value })}
                disabled={isViewer}
              />
            </Grid>

            {/* Party Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Party Email"
                value={caseData.partyEmail}
                onChange={e => setCaseData({ ...caseData, partyEmail: e.target.value })}
                disabled={isViewer}
              />
            </Grid>

            {/* Next Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Next Date"
                disabled={isViewer}
                InputLabelProps={{ shrink: true }}
                value={caseData.nextDate?.slice(0, 10)}
                onChange={e => setCaseData({ ...caseData, nextDate: e.target.value })}
              />
            </Grid>
          </Grid>

          {/* Remarks as last full-width row */}
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Remarks"
              multiline
              rows={5}
              value={caseData.remarks}
              disabled={isViewer}
              onChange={e => setCaseData({ ...caseData, remarks: e.target.value })}
            />
          </Box>

          {/* Actions */}
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent={{ xs: 'stretch', sm: 'space-between' }} spacing={2} mt={4}>
            <Button variant="outlined" onClick={() => navigate("/dashboard")} fullWidth={{ xs: true, sm: false }}>
              Back
            </Button>

            {isAdmin && (
              <Button
                variant="contained"
                color="error"
                onClick={deleteCase}
                fullWidth={{ xs: true, sm: false }}
              >
                Delete Case
              </Button>
            )}

            {!isViewer && (
              <Button variant="contained" onClick={updateCase} fullWidth={{ xs: true, sm: false }}>
                Save Changes
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}