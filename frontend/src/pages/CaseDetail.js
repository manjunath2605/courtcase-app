import { useCallback, useEffect, useState } from "react";
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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress
} from "@mui/material";

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  

const user =
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(sessionStorage.getItem("user"));
const role = user?.role;

const isAdmin = role === "admin";
const isViewer = role === "viewer";
const isClient = role === "client";
const isReadOnly = isViewer || isClient;


  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toISOString().slice(0, 10);
  };

  const fetchCase = useCallback(async () => {
    const res = await api.get(`/cases/${id}`);
    setCaseData(res.data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  const updateCase = async () => {
    try {
      setSaving(true);
      await api.put(`/cases/${id}`, caseData);
      alert("Case updated successfully");
      fetchCase();
    } catch (err) {
      console.error(err);
      alert("Failed to update case");
    } finally {
      setSaving(false);
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

  const history = Array.isArray(caseData.history) ? caseData.history : [];
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastHearing = sortedHistory[0];

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
              {isClient ? (
                <>
                  <Typography variant="body2" color="text.secondary">Case No</Typography>
                  <Typography variant="body1">{caseData.caseNo || "-"}</Typography>
                </>
              ) : (
                <TextField
                  fullWidth
                  label="Case No"
                  value={caseData.caseNo}
                  onChange={e => setCaseData({ ...caseData, caseNo: e.target.value })}
                  disabled={isReadOnly}
                />
              )}
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={6}>
              {isClient ? (
                <>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Typography variant="body1">{caseData.status || "-"}</Typography>
                </>
              ) : (
                <TextField
                  fullWidth
                  label="Status"
                  value={caseData.status}
                  onChange={e => setCaseData({ ...caseData, status: e.target.value })}
                  disabled={isReadOnly}
                />
              )}
            </Grid>

            {/* Court */}
            <Grid item xs={12} md={6}>
              {isClient ? (
                <>
                  <Typography variant="body2" color="text.secondary">Court</Typography>
                  <Typography variant="body1">{caseData.court || "-"}</Typography>
                </>
              ) : (
                <TextField
                  fullWidth
                  label="Court"
                  value={caseData.court}
                  onChange={e => setCaseData({ ...caseData, court: e.target.value })}
                  disabled={isReadOnly}
                />
              )}
            </Grid>

            {/* Party Name */}
            <Grid item xs={12} md={6}>
              {isClient ? (
                <>
                  <Typography variant="body2" color="text.secondary">Party Name</Typography>
                  <Typography variant="body1">{caseData.partyName || "-"}</Typography>
                </>
              ) : (
                <TextField
                  fullWidth
                  label="Party Name"
                  value={caseData.partyName}
                  onChange={e => setCaseData({ ...caseData, partyName: e.target.value })}
                  disabled={isReadOnly}
                />
              )}
            </Grid>

            {/* Party Email */}
            <Grid item xs={12} md={6}>
              {isClient ? (
                <>
                  <Typography variant="body2" color="text.secondary">Party Email</Typography>
                  <Typography variant="body1">{caseData.partyEmail || "-"}</Typography>
                </>
              ) : (
                <TextField
                  fullWidth
                  label="Party Email"
                  value={caseData.partyEmail}
                  onChange={e => setCaseData({ ...caseData, partyEmail: e.target.value })}
                  disabled={isReadOnly}
                />
              )}
            </Grid>

            {/* Next Date */}
            <Grid item xs={12} md={6}>
              {isClient ? (
                <>
                  <Typography variant="body2" color="text.secondary">Next Date</Typography>
                  <Typography variant="body1">{formatDate(caseData.nextDate)}</Typography>
                </>
              ) : (
                <TextField
                  fullWidth
                  type="date"
                  label="Next Date"
                  disabled={isReadOnly}
                  InputLabelProps={{ shrink: true }}
                  value={caseData.nextDate?.slice(0, 10)}
                  onChange={e => setCaseData({ ...caseData, nextDate: e.target.value })}
                />
              )}
            </Grid>
          </Grid>

          {/* Remarks as last full-width row */}
          <Box sx={{ mt: 3 }}>
            {isClient ? (
              <>
                <Typography variant="body2" color="text.secondary">Remarks</Typography>
                <Typography variant="body1">{caseData.remarks || "-"}</Typography>
              </>
            ) : (
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={5}
                value={caseData.remarks}
                disabled={isReadOnly}
                onChange={e => setCaseData({ ...caseData, remarks: e.target.value })}
              />
            )}
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hearing History
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5, color: "text.secondary" }}>
              Last Hearing: {formatDate(lastHearing?.date)} | Status: {lastHearing?.status || "-"} | Court: {lastHearing?.court || caseData.court || "-"} | Remarks: {lastHearing?.remarks || "-"}
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Date</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    <TableCell><b>Court</b></TableCell>
                    <TableCell><b>Remarks</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedHistory.map((h, index) => (
                    <TableRow key={`${h.date}-${index}`}>
                      <TableCell>{formatDate(h.date)}</TableCell>
                      <TableCell>{h.status || "-"}</TableCell>
                      <TableCell>{h.court || caseData.court || "-"}</TableCell>
                      <TableCell>{h.remarks || "-"}</TableCell>
                    </TableRow>
                  ))}
                  {sortedHistory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No hearing history yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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

            {!isReadOnly && (
              <Button variant="contained" onClick={updateCase} fullWidth={{ xs: true, sm: false }} disabled={saving}>
                {saving ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={18} color="inherit" />
                    <span>Saving...</span>
                  </Box>
                ) : (
                  "Save Changes"
                )}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
