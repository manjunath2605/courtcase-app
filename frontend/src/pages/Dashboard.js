import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
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
  Menu, 
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


const [adminAnchor, setAdminAnchor] = useState(null);

const role = user?.role;

const isAdmin = role === "admin";
const canEdit = role === "admin" || role === "user";
const isViewer = role === "viewer";

const openAdminMenu = (event) => {
  setAdminAnchor(event.currentTarget);
};

const closeAdminMenu = () => {
  setAdminAnchor(null);
};



  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const res = await api.get("/cases");
    setCases(res.data);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const today = new Date().toISOString().slice(0, 10);

  const filteredCases = cases.filter(c => {
    if (court && c.court !== court) return false;
    if (status && c.status !== status) return false;

    if (todayOnly && c.nextDate?.slice(0, 10) !== today) return false;

    if (selectedDate && c.nextDate?.slice(0, 10) !== selectedDate) return false;

    return true;
  });

  const courts = [...new Set(cases.map(c => c.court))];
  const statuses = [...new Set(cases.map(c => c.status))];

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
    <>
      {/* Top Bar */}




      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>




            {/* Filters */}
            <Grid container spacing={2} mb={4}>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Court</InputLabel>
                  <Select
                    value={court}
                    label="Court"
                    onChange={e => setCourt(e.target.value)}
                    sx={{ minWidth: 200 }}
                    
                  >
                    <MenuItem value="">All</MenuItem>
                    {courts.map(c => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    label="Status"
                    onChange={e => setStatus(e.target.value)}
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {statuses.map(s => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Next Date"
                  InputLabelProps={{ shrink: true }}
                  value={selectedDate}
                  onChange={e => {
                    setSelectedDate(e.target.value);
                    setTodayOnly(false);
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant={todayOnly ? "contained" : "outlined"}
                  onClick={() => {
                    setTodayOnly(!todayOnly);
                    setSelectedDate("");
                  }}
                  sx={{ height: "56px" }}
                >
                  Today&apos;s Cases
                </Button>
              </Grid>

              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setCourt("");
                    setStatus("");
                    setTodayOnly(false);
                    setSelectedDate("");
                  }}
                  sx={{ height: "56px" }}
                >
                  Reset Filters
                </Button>
              </Grid>

            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="contained" onClick={printTable}>
                Print
              </Button>
            </Box>
            {/* Table (Printable Area) */}
            <div ref={printRef}>
              <Table>
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
                  {filteredCases.map(c => (
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

          </CardContent>
        </Card>
      </Box>
    </>
  );
}
