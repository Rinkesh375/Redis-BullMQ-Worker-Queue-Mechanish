import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

subscriber.subscribe("notification", (err) => {
  if (err) {
    console.error(`Failed to subscribe: %s`, err.message);
  } else console.log(`Subscribed sucessfully.`);
});

subscriber.on("message", (channel, message) => {
  console.log(`Received on channel:${channel}`, JSON.parse(message));
});
