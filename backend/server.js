const express = require("express");
const cors = require("cors");
require("dotenv").config();

const aiRoutes = require("./routes/aiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Sifu Backend API is running",
    developer: "Alfaisal",
    modules: ["AI Recommendation & Intelligence", "Analytics & Insights"]
  });
});

app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sifu backend server running on http://localhost:${PORT}`);
});