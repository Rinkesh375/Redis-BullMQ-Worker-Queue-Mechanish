class EmailService {
  async sendEmail({ to, subject, body }) {
    console.log("📧 Sending email...");

    console.log({
      to,
      subject,
    });

    // Simulate an external email provider.
    await new Promise((resolve) => {
      setTimeout(resolve, 10000);
    });

    console.log(`✅ Email sent to ${to}`);

    return {
      messageId: `msg_${Date.now()}`,
      provider: "mock-provider",
    };
  }
}

module.exports = {
  EmailService,
};