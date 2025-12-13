const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const caseRoutes = require("./routes/cases");

const app = express();
app.use(cors());
app.use(express.json());


// ...existing code...

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.error("MongoDB connection error:", err));

// ...existing code...

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);

app.listen(5000, () => console.log("Backend running on port 5000"));
