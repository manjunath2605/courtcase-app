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
  Stack,
  Alert,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress
} from "@mui/material";

const COURTS = [
  "VII Addl Dist Court",
  "Senior Civil Judge - Chikodi",
  "Senior Civil Judge - Nippani",
  "Prl. Civil Judge - Chikodi",
  "Prl. Civil Judge - Nippani",
  "I Addl Civil Judge - Chikodi",
  "I Addl Civil Judge - Nippani",
  "II Addl Civil Judge - Chikodi",
  "II Addl Civil Judge - Nippani",
  "A.C. Office - Chikodi",
  "D.C. Office - Belgavi",
  "Tashildar - Chikodi",
  "Tashildar - Nippani",
  "Prl. Dist & Sessions Judge - Belgavi",
  "Other"
];

const DEFAULT_FORM = {
  caseNo: "",
  status: "",
  court: "Senior Civil Judge - Chikodi",
  otherCourt: "",
  nextDate: "",
  partyName: "",
  partyEmail: "",
  partyPhone: "",
  remarks: "",
  history: []
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 10);
};

export default function CaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role;

  const isViewer = role === "viewer";
  const isClient = role === "client";
  const isReadOnly = isViewer || isClient;
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setForm(DEFAULT_FORM);
      setError("");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchCase = async () => {
      try {
        const res = await api.get(`/cases/${id}`);
        const data = res.data;
        const history = Array.isArray(data.history) ? data.history : [];

        if (!COURTS.includes(data.court)) {
          setForm({
            ...data,
            court: "Other",
            otherCourt: data.court,
            nextDate: data.nextDate?.slice(0, 10) || "",
            history
          });
        } else {
          setForm({
            ...data,
            otherCourt: "",
            nextDate: data.nextDate?.slice(0, 10) || "",
            history
          });
        }
      } catch {
        setError("Failed to load case");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.caseNo) return "Case Number is required";
    if (!form.status) return "Stage is required";
    if (!form.court) return "Court is required";
    if (form.court === "Other" && !form.otherCourt) return "Specify Court";
    if (!form.nextDate) return "Next Hearing Date is required";
    if (!form.partyName) return "Party Name is required";
    if (!form.partyPhone) return "Party Phone is required";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      ...form,
      court: form.court === "Other" ? form.otherCourt : form.court
    };
    delete payload.otherCourt;
    delete payload.history;
    delete payload._id;
    delete payload.__v;

    try {
      setSaving(true);
      if (isEditMode) {
        await api.put(`/cases/${id}`, payload);
        alert("Case updated successfully");
      } else {
        await api.post("/cases", payload);
        alert("Case created successfully");
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteCase = async () => {
    if (!window.confirm("Delete this case?")) return;
    await api.delete(`/cases/${id}`);
    navigate("/dashboard");
  };

  if (!isEditMode && isReadOnly) {
    return (
      <Box p={4}>
        <Alert severity="warning">
          You have <strong>read-only</strong> access. You cannot add cases.
        </Alert>
      </Box>
    );
  }

  if (loading) return <Typography p={3}>Loading...</Typography>;

  const history = Array.isArray(form.history) ? form.history : [];
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastHearing = sortedHistory[0];
  const activeCourt = form.court === "Other" ? form.otherCourt : form.court;

  return (
    <Box
      p={3}
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(34,34,58,0.65), rgba(34,34,58,0.65)), url('https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <Card
        sx={{
          maxWidth: 900,
          mx: "auto",
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.30)"
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="overline" sx={{ color: "#3f4f6d", letterSpacing: 2, fontWeight: 700 }}>
                Case Workspace
              </Typography>
              <Typography variant="h5" fontWeight="bold">
              {isEditMode ? `Case No: ${form.caseNo}` : "Add New Case"}
              </Typography>
            </Box>
            {isEditMode && <Chip label={form.status} color="primary" />}
          </Stack>

          <Divider sx={{ my: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {isClient ? (
              <>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Case Number</Typography>
                  <Typography variant="body1">{form.caseNo || "-"}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Stage</Typography>
                  <Typography variant="body1">{form.status || "-"}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Court</Typography>
                  <Typography variant="body1">{activeCourt || "-"}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Next Hearing Date</Typography>
                  <Typography variant="body1">{formatDate(form.nextDate)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Party Name</Typography>
                  <Typography variant="body1">{form.partyName || "-"}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Party Email</Typography>
                  <Typography variant="body1">{form.partyEmail || "-"}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Party Phone</Typography>
                  <Typography variant="body1">{form.partyPhone || "-"}</Typography>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Case Number"
                    name="caseNo"
                    value={form.caseNo}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Stage"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    required
                    label="Court"
                    name="court"
                    value={form.court}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  >
                    {COURTS.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    fullWidth
                    required
                    label="Next Hearing Date"
                    InputLabelProps={{ shrink: true }}
                    name="nextDate"
                    value={form.nextDate}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  />
                </Grid>

                {form.court === "Other" && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Specify Court"
                      name="otherCourt"
                      value={form.otherCourt}
                      onChange={handleChange}
                      disabled={isReadOnly}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Party Name"
                    name="partyName"
                    value={form.partyName}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Party Email"
                    name="partyEmail"
                    value={form.partyEmail}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Party Phone"
                    name="partyPhone"
                    value={form.partyPhone}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Box mt={4}>
            {isClient ? (
              <>
                <Typography variant="body2" color="text.secondary">Remarks</Typography>
                <Typography variant="body1">{form.remarks || "-"}</Typography>
              </>
            ) : (
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Remarks"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            )}
          </Box>

          {isEditMode && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Hearing History
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5, color: "text.secondary" }}>
                Last Hearing: {formatDate(lastHearing?.date)} | Status: {lastHearing?.status || "-"} | Court: {lastHearing?.court || activeCourt || "-"} | Remarks: {lastHearing?.remarks || "-"}
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>Date</b>
                      </TableCell>
                      <TableCell>
                        <b>Status</b>
                      </TableCell>
                      <TableCell>
                        <b>Court</b>
                      </TableCell>
                      <TableCell>
                        <b>Remarks</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedHistory.map((h, index) => (
                      <TableRow key={`${h.date}-${index}`}>
                        <TableCell>{formatDate(h.date)}</TableCell>
                        <TableCell>{h.status || "-"}</TableCell>
                        <TableCell>{h.court || activeCourt || "-"}</TableCell>
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
          )}

          <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
            <Button onClick={() => navigate("/dashboard")}>Cancel</Button>
            {isEditMode && role === "admin" && (
              <Button color="error" variant="contained" onClick={deleteCase}>
                Delete Case
              </Button>
            )}

            {!isReadOnly && (
              <Button variant="contained" onClick={submit} disabled={saving}>
                {saving ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={18} color="inherit" />
                    <span>Saving...</span>
                  </Box>
                ) : isEditMode ? "Save Changes" : "Create Case"}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
