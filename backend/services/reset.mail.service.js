const { sendSingleEmail } = require("./mail.core");

function buildResetCodeTemplate(resetCode) {
  const base = (process.env.CLIENT_URL || "https://hubrobe.vercel.app").replace(/\/$/, "");
  return {
    subject: "Password Reset Code - hubrobe.",
    html: `
      <h2 style="text-align: center; margin-bottom: 20px;">Reset Your Password</h2>
      <p>You requested a password reset. Enter this code on the hubrobe website (Reset password page), then choose a new password:</p>
      <div style="background: #f9f9f9; padding: 30px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #000; margin: 30px 0;">
        ${resetCode}
      </div>
      <p style="text-align: center; color: #666; font-size: 14px;">This code expires in 1 hour. If you didn't request this, ignore this email.</p>
      <div style="text-align: center; margin-top: 24px;">
        <a href="${base}/reset-password" style="display: inline-block; background: #000; color: #fff; padding: 12px 28px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Open reset page</a>
      </div>
    `,
  };
}

async function sendResetPasswordEmail(email, resetCode) {
  const { subject, html } = buildResetCodeTemplate(resetCode);
  return sendSingleEmail(email, subject, html, "ResetMail");
}

module.exports = { sendResetPasswordEmail };
