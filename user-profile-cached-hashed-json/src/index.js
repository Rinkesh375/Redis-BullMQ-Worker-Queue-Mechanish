import express from "express";
import Redis from "ioredis";
import mongoose, { mongo } from "mongoose";

const app = express();
app.use(express.json())

export const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

app.post("/user/:id/json", async (req, res) => {
  const body = req.body
  await redis.set(`user:${req.params.id}:json`, JSON.stringify( body ));
  res.json({ success: true, storeAs: "JSON" });
});

app.get("/user/:id/json", async (req, res) => {
  const data = await redis.get(`user:${req.params.id}:json`);
  console.log(data)
  res.json({ success: true, data:JSON.parse(data) });
});


app.post("/user/:id/hash", async (req, res) => {
  const body = req?.body;
  await redis.hset(`user:${req.params.id}:hash`, body);
  res.json({ success: true, storeAs: "hash" });
});

app.get("/user/:id/hash", async (req, res) => {
  const data = await redis.hgetall(`user:${req.params.id}:hash`);
  res.json({ success: true, data });
});

app.listen(3000, () => {
  console.log("Application runing at port:3000");
});
