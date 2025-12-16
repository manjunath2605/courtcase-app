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
  MenuItem
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
  status: "Open",
  court: "Senior Civil Judge - Chikodi",
  otherCourt: "",
  nextDate: "",
  partyName: "",
  partyEmail: "",
  partyPhone: "",
  remarks: ""
};


export default function CaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const isViewer = role === "viewer";
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  /* =====================
     FORM STATE
  ===================== */
const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
  if (!id) {
    // 👈 entering ADD CASE
    setForm(DEFAULT_FORM);
    setError("");
    setLoading(false);
  }
}, [id]);
  /* =====================
     FETCH CASE (EDIT)
  ===================== */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchCase = async () => {
      try {
        const res = await api.get(`/cases/${id}`);
        const data = res.data;

        if (!COURTS.includes(data.court)) {
          setForm({
            ...data,
            court: "Other",
            otherCourt: data.court,
            nextDate: data.nextDate?.slice(0, 10) || ""
          });
        } else {
          setForm({
            ...data,
            otherCourt: "",
            nextDate: data.nextDate?.slice(0, 10) || ""
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

  /* =====================
     HANDLERS
  ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (isViewer) return;

    const payload = {
      ...form,
      court: form.court === "Other" ? form.otherCourt : form.court
    };
    delete payload.otherCourt;

    try {
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
    }
  };

  const deleteCase = async () => {
    if (!window.confirm("Delete this case?")) return;
    await api.delete(`/cases/${id}`);
    navigate("/dashboard");
  };

  /* =====================
     ACCESS CONTROL
  ===================== */
  if (!isEditMode && isViewer) {
    return (
      <Box p={4}>
        <Alert severity="warning">
          You have <strong>read-only</strong> access. You cannot add cases.
        </Alert>
      </Box>
    );
  }

  if (loading) return <Typography p={3}>Loading…</Typography>;



  return (
    <Box p={3}>
      <Card sx={{ maxWidth: 900, mx: "auto", borderRadius: 3 }}>
        <CardContent>
          {/* HEADER */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              {isEditMode ? `Case No: ${form.caseNo}` : "Add New Case"}
            </Typography>

            {isEditMode && (
              <Chip
                label={form.status}
                color={form.status === "Closed" ? "success" : "primary"}
              />
            )}
          </Stack>

          <Divider sx={{ my: 3 }} />

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* FORM GRID */}
          <Grid container spacing={3}>
            {/* ROW 1 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Case Number"
                name="caseNo"
                value={form.caseNo}
                onChange={handleChange}
                disabled={isViewer}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={isViewer}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
                <MenuItem value="Adjourned">Adjourned</MenuItem>
              </TextField>
            </Grid>

            {/* ROW 2 */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Court"
                name="court"
                value={form.court}
                onChange={handleChange}
                disabled={isViewer}
              >
                {COURTS.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Grid>
        {/* ROW 3 */}
            {form.court === "Other" && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Specify Court"
                  name="otherCourt"
                  value={form.otherCourt}
                  onChange={handleChange}
                  disabled={isViewer}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                fullWidth
                label="Next Hearing Date"
                name="nextDate"
                InputLabelProps={{ shrink: true }}
                value={form.nextDate}
                onChange={handleChange}
                disabled={isViewer}
              />
            </Grid>

    

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Party Name"
                name="partyName"
                value={form.partyName}
                onChange={handleChange}
                disabled={isViewer}
              />
            </Grid>

            {/* ROW 4 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Party Email"
                name="partyEmail"
                type="email"
                value={form.partyEmail}
                onChange={handleChange}
                disabled={isViewer}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Party Phone"
                name="partyPhone"
                type="tel"
                value={form.partyPhone}
                onChange={handleChange}
                disabled={isViewer}
                placeholder="e.g. 9876543210"
                inputProps={{ maxLength: 15 }}
              />
            </Grid>
          </Grid>

          {/* REMARKS – FULL WIDTH LAST */}
          <Box mt={4}>
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Remarks"
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              disabled={isViewer}
            />
          </Box>

          {/* ACTIONS */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            mt={4}
            justifyContent="space-between"
          >
            <Button variant="outlined" onClick={() => navigate("/dashboard")}>
              Back
            </Button>

            {isEditMode && role === "admin" && (
              <Button color="error" variant="contained" onClick={deleteCase}>
                Delete Case
              </Button>
            )}

            {!isViewer && (
              <Button variant="contained" onClick={submit}>
                {isEditMode ? "Save Changes" : "Create Case"}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
