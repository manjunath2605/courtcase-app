import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Grid,
  TextField,
  TableContainer,
  Paper,
  Stack
} from "@mui/material";

export default function Dashboard() {
  const navigate = useNavigate();
  const printRef = useRef();

  const [cases, setCases] = useState([]);
  const [court, setCourt] = useState("");
  const [status, setStatus] = useState("");
  const [todayOnly, setTodayOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const isAdmin = role === "admin";
  const canEdit = role === "admin" || role === "user";
  const isViewer = role === "viewer";

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const res = await api.get("/cases");
    setCases(res.data);
  };

  const today = new Date().toISOString().slice(0, 10);

  const filteredCases = cases.filter((c) => {
    if (court && c.court !== court) return false;
    if (status && c.status !== status) return false;
    if (todayOnly && c.nextDate?.slice(0, 10) !== today) return false;
    if (selectedDate && c.nextDate?.slice(0, 10) !== selectedDate) return false;
    return true;
  });

  const courts = [...new Set(cases.map((c) => c.court))];
  const statuses = [...new Set(cases.map((c) => c.status))];

  const printTable = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=650");

    win.document.write(`
      <html>
        <head>
          <title>Print Cases</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Court Case List</h2>
          ${printContent}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          {/* HEADER */}
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Cases Dashboard
          </Typography>

          {/* FILTERS */}
 {/* FILTERS */}
<Box sx={{ mb: 4 }}>
  <Stack
    direction="row"
    spacing={2}
    useFlexGap
    sx={{
      flexWrap: "wrap"
    }}
  >
    {/* Court */}
    <FormControl sx={{ minWidth: 160 }}>
      <InputLabel>Court</InputLabel>
      <Select
        value={court}
        label="Court"
        onChange={(e) => setCourt(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        {courts.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Status */}
    <FormControl sx={{ minWidth: 160 }}>
      <InputLabel>Status</InputLabel>
      <Select
        value={status}
        label="Status"
        onChange={(e) => setStatus(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        {statuses.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Date */}
    <TextField
      type="date"
      label="Next Date"
      InputLabelProps={{ shrink: true }}
      value={selectedDate}
      onChange={(e) => {
        setSelectedDate(e.target.value);
        setTodayOnly(false);
      }}
      sx={{ minWidth: 170 }}
    />

    {/* Today */}
    <Button
      variant={todayOnly ? "contained" : "outlined"}
      onClick={() => {
        setTodayOnly(!todayOnly);
        setSelectedDate("");
      }}
      sx={{
        height: "56px",
        whiteSpace: "nowrap"
      }}
    >
      Today&apos;s Cases
    </Button>

    {/* Reset */}
    <Button
      variant="outlined"
      onClick={() => {
        setCourt("");
        setStatus("");
        setTodayOnly(false);
        setSelectedDate("");
      }}
      sx={{
        height: "56px",
        whiteSpace: "nowrap"
      }}
    >
      Reset Filters
    </Button>
  </Stack>
</Box>



          {/* PRINT BUTTON */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" onClick={printTable}>
              Print
            </Button>
          </Box>

          {/* SCROLLABLE TABLE */}
          <TableContainer
            component={Paper}
            sx={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch"
            }}
          >
            <div ref={printRef}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Case No</b></TableCell>
                    <TableCell><b>Court</b></TableCell>
                    <TableCell><b>Party Name</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    <TableCell><b>Next Date</b></TableCell>
                    <TableCell><b>Remarks</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredCases.map((c) => (
                    <TableRow key={c._id} hover>
                      <TableCell>
                        <Link
                          to={`/cases/${c._id}`}
                          style={{ textDecoration: "none", color: "#1976d2" }}
                        >
                          {c.caseNo}
                        </Link>
                      </TableCell>
                      <TableCell>{c.court}</TableCell>
                      <TableCell>{c.partyName}</TableCell>
                      <TableCell>{c.status}</TableCell>
                      <TableCell>{c.nextDate?.slice(0, 10)}</TableCell>
                      <TableCell>{c.remarks}</TableCell>
                    </TableRow>
                  ))}

                  {filteredCases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
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