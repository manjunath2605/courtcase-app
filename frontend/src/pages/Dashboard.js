import { useEffect, useState, useRef } from "react";
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


  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

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

  const printTable = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=650");

    win.document.write(`
      <html>
        <head>
          <title>Cases List</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #333; padding: 8px; }
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
    <Box sx={{ p: { xs: 2, md: 3 }, background: "#f5f7f6" }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          {/* HEADER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3
            }}
          >
            <Typography variant="h5" fontWeight="bold" color="#1f4f46">
              Cases Dashboard
            </Typography>

            <Button variant="contained" onClick={printTable}>
              Print
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* FILTERS */}
          <Box sx={{ mb: 4 }}>
            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              flexWrap="wrap"

            >

              {/* 🔍 SEARCH */}
              <TextField
                label="Search Case No / Court / Party Name"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 260 }}
              />
              <FormControl sx={{ minWidth: 180 }}>
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

              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Stage</InputLabel>
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
                sx={{ height: 56 }}
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
                }}
                sx={{ height: 56 }}
              >
                Reset
              </Button>
            </Stack>
          </Box>

          {/* TABLE */}
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <div ref={printRef}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead sx={{ background: "#f1f5f4" }}>
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
                          style={{
                            textDecoration: "none",
                            color: "#1f4f46",
                            fontWeight: 600
                          }}
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
