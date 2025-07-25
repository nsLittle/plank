const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

console.log("🌱 Bare minimum backend index file loaded");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error: Error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

app.get("/", (req: any, res: any) => {
  res.send("Server is running!");
});

app.use((req: any, res: any, next: any) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use("/auth", authRoutes);

const lapRoutes = require("./routes/lapRoutes");
app.use("/laps", lapRoutes);
