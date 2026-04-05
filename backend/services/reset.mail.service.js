const { sendSingleEmail } = require("./mail.core");

function buildResetTemplate(resetCode) {
  return {
    subject: "Password Reset Code - hubrobe.",
    html: `
      <h2 style="text-align: center; margin-bottom: 20px;">Reset Your Password</h2>
      <p>You requested a password reset for your hubrobe account. Use the code below to complete the process:</p>
      <div style="background: #f9f9f9; padding: 30px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #000; margin: 30px 0;">
        ${resetCode}
      </div>
      <p style="text-align: center; color: #666; font-size: 14px;">This code will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `,
  };
}

async function sendResetPasswordEmail(email, resetCode) {
  const { subject, html } = buildResetTemplate(resetCode);
  return sendSingleEmail(email, subject, html, "ResetMail");
}

module.exports = { sendResetPasswordEmail };
