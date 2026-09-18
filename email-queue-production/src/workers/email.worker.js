require("dotenv").config();

const { Worker } = require("bullmq");

const {
  redisConnection,
} = require("../config/redis");

const {
  EmailService,
} = require("../services/email.service");

const emailService = new EmailService();

const worker = new Worker(
  "email",

  async (job) => {
    console.log(
      `📥 Processing job ${job.id}`,
    );

    console.log({
      jobId: job.id,
      jobName: job.name,
      attempt: job.attemptsMade + 1,
      data: job.data,
    });

    const result =
      await emailService.sendEmail(job.data);

    console.log(
      `✅ Job ${job.id} completed`,
    );

    return result;
  },

  {
    connection: redisConnection,

    concurrency: 5,
  },
);

worker.on("completed", (job, result) => {
  console.log("🎉 Job completed:", {
    jobId: job.id,
    result,
  });
});

worker.on("failed", (job, error) => {
  console.error("❌ Job failed:", {
    jobId: job?.id,
    attemptsMade: job?.attemptsMade,
    error: error.message,
  });
});

worker.on("error", (error) => {
  console.error(
    "❌ Worker error:",
    error,
  );
});

worker.on("ready", () => {
  console.log("👷 Email worker is ready");
});

async function shutdown(signal) {
  console.log(`\n⚠️ ${signal} received`);

  console.log(
    "Stopping email worker...",
  );

  try {
    await worker.close();

    console.log(
      "Closing Redis connection...",
    );

    await redisConnection.quit();

    console.log(
      "✅ Worker shutdown completed",
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Worker shutdown error:",
      error,
    );

    process.exit(1);
  }
}

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});