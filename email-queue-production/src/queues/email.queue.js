const { Queue } = require("bullmq");
const { redisConnection } = require("../config/redis");

const emailQueue = new Queue("email", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 1000,
    },

    removeOnComplete: {
      age: 60 * 60,
      count: 1000,
    },

    removeOnFail: {
      age: 24 * 60 * 60,
      count: 5000,
    },
  },
});

emailQueue.on("error", (error) => {
  console.error("❌ Email queue error:", error);
});

module.exports = {
  emailQueue,
};