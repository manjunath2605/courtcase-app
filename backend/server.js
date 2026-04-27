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
  "http://localhost:3001",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:5173",
  ...configuredOrigins
]);

const isLoopbackOrigin = (origin) => {
  if (!origin) return false;

  try {
    const parsed = new URL(origin);
    const host = parsed.hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
};

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    const isDevelopment = process.env.NODE_ENV !== "production";
    if (!origin || allowlist.has(origin) || (isDevelopment && isLoopbackOrigin(origin))) {
      return callback(null, true);
    }
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
