const { sendSingleEmail } = require("./mail.core");

function buildWelcomeTemplate(couponCode) {
  return {
    subject: "Welcome to hubrobe. - Your 20% Discount Inside",
    html: `
      <h2 style="text-align: center; margin-bottom: 20px;">Welcome to the family!</h2>
      <p>We're thrilled to have you with us. As a special welcome, here's an exclusive discount for your first order:</p>
      <div style="background: #f9f9f9; padding: 30px; text-align: center; font-size: 28px; font-weight: bold; border: 2px dashed #000; margin: 30px 0; letter-spacing: 2px;">
        ${couponCode}
      </div>
      <p style="text-align: center; font-weight: bold;">Use this code at checkout to get 20% OFF your entire purchase.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://hubrobe.vercel.app/shop" style="display: inline-block; background: #000; color: #fff; padding: 15px 35px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 13px; letter-spacing: 1px;">Shop Now</a>
      </div>
    `,
  };
}

async function sendWelcomeEmail(email, couponCode) {
  const { subject, html } = buildWelcomeTemplate(couponCode);
  return sendSingleEmail(email, subject, html, "WelcomeMail");
}

module.exports = { sendWelcomeEmail };
