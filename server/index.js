require("dotenv").config();

const express = require("express");
const cors = require("cors");
// const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("server/swagger.yaml");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.options("*", cors());
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Plank App server is running!");
});

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

const lapRoutes = require("./routes/lapRoutes");
app.use("/laps", lapRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
