const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const caseRoutes = require("./routes/cases");
const chatRoutes = require("./routes/chat");

const app = express();
app.use(cors());
app.use(express.json());


// ...existing code...

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.error("MongoDB connection error:", err));

// ...existing code...

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/chat", chatRoutes);


app.listen(5000, () => console.log("Backend running on port 5000"));
