const dns = require("dns");
const nodemailer = require("nodemailer");
const path = require("path");
// Ensure dotenv is loaded from the correct path
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Render and similar hosts often lack working IPv6 egress; Gmail resolves to IPv6 first.
try {
  if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (_) {
  /* ignore */
}

const SMTP_HOSTNAME = "smtp.gmail.com";
const SMTP_IPV4_CACHE_TTL_MS = 5 * 60 * 1000;
let smtpIpv4Cache = { address: null, expires: 0 };

function invalidateSmtpIpv4Cache() {
  smtpIpv4Cache = { address: null, expires: 0 };
}

/** Merge A records from system DNS + public resolvers (Render often returns a single IP that may not route). */
async function resolveSmtpIpv4Records() {
  const seen = new Set();
  const add = (list) => {
    for (const ip of list || []) seen.add(ip);
  };

  try {
    add(await dns.promises.resolve4(SMTP_HOSTNAME));
  } catch (_) {}

  for (const server of ["8.8.8.8", "1.1.1.1"]) {
    try {
      const resolver = new dns.promises.Resolver();
      resolver.setServers([server]);
      add(await resolver.resolve4(SMTP_HOSTNAME));
    } catch (_) {}
  }

  const list = [...seen];
  if (!list.length) {
    throw new Error(`[EmailService] No IPv4 (A) for ${SMTP_HOSTNAME}`);
  }
  return list;
}

/** Gmail A records only — nodemailer can still open IPv6 sockets despite custom lookup. */
async function getSmtpIpv4Address() {
  const now = Date.now();
  if (smtpIpv4Cache.address && smtpIpv4Cache.expires > now) {
    return smtpIpv4Cache.address;
  }
  const records = await resolveSmtpIpv4Records();
  const address = records[Math.floor(Math.random() * records.length)];
  smtpIpv4Cache = { address, expires: now + SMTP_IPV4_CACHE_TTL_MS };
  return address;
}

const SMTP_SUBMISSION = { port: 587, secure: false, requireTLS: true, label: "587" };
const SMTP_SMTPS = { port: 465, secure: true, requireTLS: false, label: "465" };

function closeTransport(transporter) {
  return new Promise((resolve) => {
    transporter.close(() => resolve());
  });
}

function isRetryableSmtpError(err) {
  const msg = ((err && err.message) || "").toLowerCase();
  if (/535|authentication failed|invalid login|bad credentials|eauth/.test(msg)) {
    return false;
  }
  return (
    /timeout/.test(msg) ||
    /etimedout/.test(msg) ||
    /econnreset/.test(msg) ||
    /econnrefused/.test(msg) ||
    /enetunreach/.test(msg) ||
    /enotfound/.test(msg)
  );
}

/**
 * Common Email Layout
 */
const emailLayout = (content) => `
  <div style="font-family: 'Sofia Pro', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 40px; color: #000;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0;">hubrobe.</h1>
    </div>
    ${content}
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 12px; color: #888; margin-bottom: 10px;">&copy; 2026 hubrobe. All rights reserved.</p>
      <div style="font-size: 12px; color: #888;">
        <a href="#" style="color: #888; text-decoration: underline;">Unsubscribe</a> | 
        <a href="#" style="color: #888; text-decoration: underline;">Privacy Policy</a>
      </div>
    </div>
  </div>
`;

/**
 * Email Templates
 */
const templates = {
  welcome: (couponCode) => ({
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
    `
  }),
  resetPassword: (resetCode) => ({
    subject: "Password Reset Code - hubrobe.",
    html: `
      <h2 style="text-align: center; margin-bottom: 20px;">Reset Your Password</h2>
      <p>You requested a password reset for your hubrobe account. Use the code below to complete the process:</p>
      <div style="background: #f9f9f9; padding: 30px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #000; margin: 30px 0;">
        ${resetCode}
      </div>
      <p style="text-align: center; color: #666; font-size: 14px;">This code will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `
  }),
  newsletter: (subject, content) => ({
    subject: subject,
    html: `
      <div style="line-height: 1.6; color: #333;">
        ${content}
      </div>
    `
  }),
  blog: (blogTitle, blogDesc, blogId) => ({
    subject: `New on the Blog: ${blogTitle}`,
    html: `
      <h2 style="color: #000; margin-bottom: 15px;">${blogTitle}</h2>
      <p style="color: #444; line-height: 1.6; margin-bottom: 25px;">${blogDesc}</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://hubrobe.vercel.app/news/${blogId}" style="display: inline-block; background: #000; color: #fff; padding: 15px 35px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 13px; letter-spacing: 1px;">Read Full Article</a>
      </div>
    `
  })
};

/**
 * Core Mail Sender (welcome, reset, blog, single newsletter)
 * Pooled transport + verify + multi-IP retries — same resilience pattern as bulk, without changing bulk code.
 */
const sendMail = async (to, templateName, templateData) => {
  console.log(`[EmailService] Attempting to send ${templateName} to: ${to}`);

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error("[EmailService] Missing credentials in process.env");
    throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
  }

  const templateFunc = templates[templateName];
  if (!templateFunc) {
    throw new Error(`Template ${templateName} not found.`);
  }

  const template = templateFunc(...templateData);
  const mailOptions = {
    from: `"hubrobe" <${user}>`,
    to,
    subject: template.subject,
    html: emailLayout(template.html),
  };

  const records = await resolveSmtpIpv4Records();
  const order = [...records].sort(() => Math.random() - 0.5);
  const ipCap = Math.min(6, order.length);
  const profiles = [SMTP_SUBMISSION, SMTP_SMTPS];
  const maxAttempts = ipCap * profiles.length;
  let lastError;
  let attemptIdx = 0;

  for (let ipIndex = 0; ipIndex < ipCap; ipIndex++) {
    const smtpHost = order[ipIndex];
    for (const p of profiles) {
      attemptIdx += 1;
      const transporter = nodemailer.createTransport({
        pool: true,
        maxConnections: 1,
        maxMessages: 5,
        host: smtpHost,
        port: p.port,
        secure: p.secure,
        requireTLS: p.requireTLS,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false,
          servername: SMTP_HOSTNAME,
        },
        connectionTimeout: 35000,
        greetingTimeout: 35000,
        socketTimeout: 35000,
      });

      try {
        await transporter.verify();
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Success: ${templateName} sent to ${to}. ID: ${info.messageId}`);
        await closeTransport(transporter);
        return info;
      } catch (error) {
        lastError = error;
        console.error(
          `[EmailService] SMTP attempt ${attemptIdx}/${maxAttempts} (${smtpHost}:${p.label}) ${templateName} → ${to}:`,
          error.message
        );
        await closeTransport(transporter).catch(() => {});

        if (!isRetryableSmtpError(error)) {
          console.error(`[EmailService] Failure: ${templateName} to ${to}. Error:`, error.message);
          throw error;
        }
        if (attemptIdx < maxAttempts) {
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    }
  }

  console.error(`[EmailService] Failure: ${templateName} to ${to}. Error:`, lastError.message);
  throw lastError;
};

/**
 * One pooled SMTP session + sequential messages — avoids Gmail/Render overload from N parallel TLS handshakes.
 */
async function sendNewsletterBulk(recipientEmails, subject, content) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
  }

  const template = templates.newsletter(subject, content);
  const html = emailLayout(template.html);
  const mailSubject = template.subject;

  async function sendWithHost(smtpHost) {
    const transporter = nodemailer.createTransport({
      pool: true,
      maxConnections: 1,
      maxMessages: 500,
      host: smtpHost,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
        servername: SMTP_HOSTNAME,
      },
      connectionTimeout: 60000,
      greetingTimeout: 60000,
      socketTimeout: 60000,
    });

    const settled = [];
    try {
      await transporter.verify();
      for (let i = 0; i < recipientEmails.length; i++) {
        const to = recipientEmails[i];
        console.log(`[EmailService] Attempting to send newsletter to: ${to}`);
        try {
          const info = await transporter.sendMail({
            from: `"hubrobe" <${user}>`,
            to,
            subject: mailSubject,
            html,
          });
          console.log(`[EmailService] Success: newsletter sent to ${to}. ID: ${info.messageId}`);
          settled.push({ status: "fulfilled", value: info });
        } catch (err) {
          console.error(`[EmailService] Failure: newsletter to ${to}. Error:`, err.message);
          settled.push({ status: "rejected", reason: err });
        }
        if (i < recipientEmails.length - 1) {
          await new Promise((r) => setTimeout(r, 450));
        }
      }
    } finally {
      await closeTransport(transporter);
    }
    return settled;
  }

  try {
    return await sendWithHost(await getSmtpIpv4Address());
  } catch (err) {
    invalidateSmtpIpv4Cache();
    return await sendWithHost(await getSmtpIpv4Address());
  }
}

/**
 * Exported functions (named exports for better compatibility)
 */
module.exports.sendWelcomeEmail = (email, couponCode) => sendMail(email, 'welcome', [couponCode]);
module.exports.sendResetPasswordEmail = (email, resetCode) => sendMail(email, 'resetPassword', [resetCode]);
module.exports.sendNewsletterEmail = (email, subject, content) => sendMail(email, 'newsletter', [subject, content]);
module.exports.sendNewsletterBulk = sendNewsletterBulk;
module.exports.sendNewBlogEmail = (email, blogTitle, blogDesc, blogId) => sendMail(email, 'blog', [blogTitle, blogDesc, blogId]);
