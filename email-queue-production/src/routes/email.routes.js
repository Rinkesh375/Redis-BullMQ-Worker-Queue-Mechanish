const express = require("express");
const { z } = require("zod");

const { emailQueue } = require("../queues/email.queue");

const router = express.Router();

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1),
});

router.post("/email", async (req, res, next) => {
  try {
    const emailData = emailSchema.parse(req.body);

    const job = await emailQueue.add(
      "send-email",
      emailData,
    );

    return res.status(202).json({
      success: true,
      message: "Email queued successfully",
      jobId: job.id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;