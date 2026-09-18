require("dotenv").config();

const express = require("express");

const { redisConnection } = require("./config/redis");
const emailRoutes = require("./routes/email.routes");

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    const redisStatus = redisConnection.status;

    return res.status(200).json({
      success: true,
      application: "email-queue-api",
      redis: redisStatus,
      uptime: process.uptime(),
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: "Service unavailable",
    });
  }
});

app.use("/api", emailRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error("❌ API error:", error);

  if (error.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Invalid request data",
      errors: error.issues,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});

async function shutdown(signal) {
  console.log(`\n⚠️ ${signal} received`);

  console.log("Stopping API server...");

  server.close(async () => {
    try {
      console.log("Closing Redis connection...");

      await redisConnection.quit();

      console.log("✅ Shutdown completed");

      process.exit(0);
    } catch (error) {
      console.error("❌ Shutdown error:", error);

      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});