const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const caseRoutes = require("./routes/cases");
const chatRoutes = require("./routes/chat");
const contactRoutes = require("./routes/contact");

const app = express();
const configuredOrigins = [
  process.env.APP_BASE_URL,
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : [])
]
  .map((origin) => String(origin || "").trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowlist = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...configuredOrigins
]);

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowlist.has(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;


// ...existing code...

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.error("MongoDB connection error:", err));

// ...existing code...

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);


app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
