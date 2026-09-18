const IORedis = require("ioredis");

const redisUrl =
  process.env.REDIS_URL || "redis://localhost:6379";

const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => {
  console.log("✅ Redis connected");
});

redisConnection.on("ready", () => {
  console.log("✅ Redis ready");
});

redisConnection.on("error", (error) => {
  console.error("❌ Redis connection error:", error);
});

redisConnection.on("close", () => {
  console.log("⚠️ Redis connection closed");
});

module.exports = {
  redisConnection,
};