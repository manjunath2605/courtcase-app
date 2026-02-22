import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  TableContainer,
  Paper,
  Stack,
  Chip,
  Divider
} from "@mui/material";

export default function Dashboard() {
  const printRef = useRef();

  const [cases, setCases] = useState([]);
  const [court, setCourt] = useState("");
  const [status, setStatus] = useState("");
  const [todayOnly, setTodayOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const res = await api.get("/cases");
    setCases(res.data);
  };

  const today = new Date().toISOString().slice(0, 10);

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toISOString().slice(0, 10);
  };

  const getLastHearing = (caseData) => {
    const history = Array.isArray(caseData.history) ? caseData.history : [];
    if (history.length === 0) {
      return {
        date: caseData.nextDate,
        status: caseData.status,
        remarks: caseData.remarks
      };
    }

    return [...history].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  };

  const filteredCases = cases.filter((c) => {
    if (court && c.court !== court) return false;
    if (status && c.status !== status) return false;
    if (todayOnly && c.nextDate?.slice(0, 10) !== today) return false;
    if (selectedDate && c.nextDate?.slice(0, 10) !== selectedDate) return false;

    if (search) {
      const q = search.toLowerCase();
      return (
        c.caseNo?.toString().toLowerCase().includes(q) ||
        c.court?.toLowerCase().includes(q) ||
        c.partyName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const courts = [...new Set(cases.map((c) => c.court))];
  const statuses = [...new Set(cases.map((c) => c.status))];

  const stats = useMemo(() => {
    const total = cases.length;
    const todayCases = cases.filter((c) => c.nextDate?.slice(0, 10) === today).length;
    const openCases = cases.filter((c) => (c.status || "").toLowerCase() === "open").length;
    const closedCases = cases.filter((c) => (c.status || "").toLowerCase() === "closed").length;
    return { total, todayCases, openCases, closedCases };
  }, [cases, today]);

  const printTable = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "", "width=1100,height=700");

    win.document.write(`
      <html>
        <head>
          <title>Cases List</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Court Case Dashboard Export</h2>
          ${printContent}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
        backgroundImage:
          "radial-gradient(circle at 20% 15%, rgba(214,255,241,0.28), transparent 30%), radial-gradient(circle at 85% 10%, rgba(198,226,255,0.22), transparent 24%), linear-gradient(135deg, #0d1f2d 0%, #153b56 45%, #0a5b4f 100%)"
      }}
    >
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
          bgcolor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)"
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 2
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 2, color: "#2d5f54", fontWeight: 700 }}>
                Operations Console
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: "#0d2b46" }}>
                Court Cases Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Track hearings, stages, and case activity in one place
              </Typography>
            </Box>
            <Button variant="contained" onClick={printTable} sx={{ borderRadius: 99, px: 3 }}>
              Print Report
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
            <Card sx={{ flex: 1, borderRadius: 3, bgcolor: "#e6f5ef", border: "1px solid #c7e7da" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Total Cases</Typography>
                <Typography variant="h5" fontWeight="bold" color="#0c503f">{stats.total}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, borderRadius: 3, bgcolor: "#edf5ff", border: "1px solid #d2e4ff" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Today&apos;s Hearings</Typography>
                <Typography variant="h5" fontWeight="bold" color="#184b87">{stats.todayCases}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, borderRadius: 3, bgcolor: "#fff8e9", border: "1px solid #ffe9b9" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Open Cases</Typography>
                <Typography variant="h5" fontWeight="bold" color="#8a6512">{stats.openCases}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, borderRadius: 3, bgcolor: "#ffeef0", border: "1px solid #ffd1d7" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Closed Cases</Typography>
                <Typography variant="h5" fontWeight="bold" color="#a42038">{stats.closedCases}</Typography>
              </CardContent>
            </Card>
          </Stack>

          <Card sx={{ mb: 3, borderRadius: 3, bgcolor: "#f7fbfa", border: "1px solid #e4efec" }}>
            <CardContent>
              <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                <TextField
                  label="Search Case No / Court / Party Name"
                  placeholder="Type to search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ minWidth: 270 }}
                />

                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel>Court</InputLabel>
                  <Select value={court} label="Court" onChange={(e) => setCourt(e.target.value)}>
                    <MenuItem value="">All</MenuItem>
                    {courts.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel>Stage</InputLabel>
                  <Select value={status} label="Stage" onChange={(e) => setStatus(e.target.value)}>
                    <MenuItem value="">All</MenuItem>
                    {statuses.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  label="Next Date"
                  InputLabelProps={{ shrink: true }}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setTodayOnly(false);
                  }}
                  sx={{ minWidth: 180 }}
                />

                <Button
                  variant={todayOnly ? "contained" : "outlined"}
                  onClick={() => {
                    setTodayOnly(!todayOnly);
                    setSelectedDate("");
                  }}
                  sx={{ height: 56, borderRadius: 2 }}
                >
                  Today&apos;s Cases
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setCourt("");
                    setStatus("");
                    setTodayOnly(false);
                    setSelectedDate("");
                    setSearch("");
                  }}
                  sx={{ height: 56, borderRadius: 2 }}
                >
                  Reset
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              border: "1px solid #dce7e4",
              boxShadow: "0 8px 24px rgba(16,34,53,0.08)"
            }}
          >
            <div ref={printRef}>
              <Table sx={{ minWidth: 980 }}>
                <TableHead>
                  <TableRow sx={{ background: "linear-gradient(90deg, #0f3d5b 0%, #135470 100%)" }}>
                    {["Case No", "Court", "Party Name", "Current Stage", "Next Date", "Last Hearing Date", "Last Hearing Status", "Last Hearing Remarks"].map((head) => (
                      <TableCell key={head} sx={{ color: "#fff", fontWeight: 700 }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredCases.map((c, idx) => {
                    const lastHearing = getLastHearing(c);
                    return (
                      <TableRow
                        key={c._id}
                        hover
                        sx={{
                          backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fcfb",
                          "&:hover": { backgroundColor: "#eef7f4" }
                        }}
                      >
                        <TableCell>
                          <Link
                            to={`/cases/${c._id}`}
                            style={{ textDecoration: "none", color: "#0f4f7a", fontWeight: 700 }}
                          >
                            {c.caseNo}
                          </Link>
                        </TableCell>
                        <TableCell>{c.court}</TableCell>
                        <TableCell>{c.partyName}</TableCell>
                        <TableCell>
                          <Chip
                            label={c.status}
                            color={
                              c.status === "Open"
                                ? "success"
                                : c.status === "Closed"
                                  ? "error"
                                  : "warning"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(c.nextDate)}</TableCell>
                        <TableCell>{formatDate(lastHearing?.date)}</TableCell>
                        <TableCell>{lastHearing?.status || "-"}</TableCell>
                        <TableCell>{lastHearing?.remarks || "-"}</TableCell>
                      </TableRow>
                    );
                  })}

                  {filteredCases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No cases found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
