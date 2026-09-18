import express from 'express';
import { emailQueue } from './queue.js';

const app = express();

app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const job = await emailQueue.add(
    "send-welcome-001",
    {
      to: req.body.to,
      body: req.body.body || "Hello User"
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000
      }
    }
  );

  return res.json({
    message: "Welcome mail job added to queue",
    jobId: job.id
  });
});


app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});