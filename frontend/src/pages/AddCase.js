import { useState } from "react";
import api from "../api";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Stack,
    Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AddCase() {
    const navigate = useNavigate();

    const user =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user"));
    const role = user?.role;
    const isViewer = role === "viewer";

    const [form, setForm] = useState({
        caseNo: "",
        court: "",
        partyName: "",
        partyEmail: "",
        status: "Open",
        nextDate: "",
        remarks: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (isViewer) return;

        try {
            setLoading(true);
            await api.post("/cases", form);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to add case");
        } finally {
            setLoading(false);
        }
    };

    /* =======================
       VIEWER BLOCK
    ======================= */
    if (isViewer) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="warning">
                    You have <strong>read-only</strong> access. You cannot add cases.
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "75vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Card sx={{ width: "100%", maxWidth: 900 }}>
                <CardContent>
                    {/* HEADER */}
                    <Typography variant="h4" fontWeight="bold" mb={1}>
                        Add New Case
                    </Typography>
                    <Typography color="text.secondary" mb={3}>
                        Enter court case details below
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {/* FORM */}
                    <form onSubmit={submit}>
                        <Grid container spacing={3}>
                            {/* CASE NO */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Case Number"
                                    name="caseNo"
                                    value={form.caseNo}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            {/* STATUS */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Status"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            {/* COURT */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Court"
                                    name="court"
                                    value={form.court}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            {/* NEXT DATE */}
                            <Grid item xs={12} sm={12} md={6}>
                                <TextField
                                    type="date"
                                    label="Next Hearing Date"
                                    name="nextDate"
                                    InputLabelProps={{ shrink: true }}
                                    value={form.nextDate}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            {/* PARTY NAME */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Party Name"
                                    name="partyName"
                                    value={form.partyName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            {/* PARTY EMAIL */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Party Email"
                                    name="partyEmail"
                                    type="email"
                                    value={form.partyEmail}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            {/* REMARKS – LAST ROW ONLY (LIKE CASE DETAIL) */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Remarks"
                                    name="remarks"
                                    value={form.remarks}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    maxRows={3}
                                    placeholder="Optional remarks"
                                />
                            </Grid>

                        </Grid>

                        {/* ACTIONS */}
                        <Stack direction="row" justifyContent="space-between" mt={4}>
                            <Button variant="outlined" onClick={() => navigate("/dashboard")}>
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Case"}
                            </Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
