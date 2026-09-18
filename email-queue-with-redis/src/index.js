import express from "express";
import Redis from "ioredis";
import mongoose, { mongo } from "mongoose";

const app = express();
app.use(express.json());

export const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

const QueueKey = "email:queue";

app.post("/email", async (req, res) => {
  const data = req.body;

  const job = await redis.lpush(
    QueueKey,
    JSON.stringify({ ...data, createdAt: new Date().toISOString() }),
  );
  return res.json({ success: true, job });
});

app.get("/email/process", async (req, res) => {
  const rawJob = await redis.rpop(QueueKey);
  if (!rawJob) {
    return res.json({ success: false, message: "No job in queue" });
  }

  const job = JSON.parse(rawJob);

  return res.json({ success: true, job,message:"Job process done" });
});

app.listen(3000, () => {
  console.log("Application runing at port:3000");
});
