const dns = require("dns");
const nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

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
    throw new Error(`[Mail] No IPv4 (A) for ${SMTP_HOSTNAME}`);
  }
  return list;
}

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

function createPooledGmailTransport(user, pass, ipv4Host, maxMessages) {
  return nodemailer.createTransport({
    pool: true,
    maxConnections: 1,
    maxMessages,
    host: ipv4Host,
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
}

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

function emailLayout(content) {
  return `
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
}

/**
 * Brevo (Sendinblue) API — Reliable in many regions like Algeria.
 * Env: BREVO_API_KEY=xkeysib-... | BREVO_SENDER="hubrobe <noreply@yourdomain.com>"
 */
async function trySendBrevo(to, subject, html, logTag) {
  const key = process.env.BREVO_API_KEY?.trim();
  if (!key) return null;

  try {
    const SibApiV3Sdk = require("sib-api-v3-sdk");
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = key;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const senderEmail = process.env.BREVO_SENDER || process.env.EMAIL_USER || "noreply@hubrobe.com";
    
    const sendSmtpEmail = {
      to: [{ email: to }],
      sender: { email: senderEmail, name: "hubrobe" },
      subject: subject,
      htmlContent: html,
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`[${logTag}] Brevo OK → ${to} id=${data?.messageId ?? "?"}`);
    return { messageId: data?.messageId };
  } catch (error) {
    const msg = error.response?.text || error.message || JSON.stringify(error);
    console.error(`[${logTag}] Brevo error detail:`, msg);
    throw new Error(`Brevo failed: ${msg}`);
  }
}

/**
 * Resend API (HTTPS) — works reliably from Render; Gmail SMTP often times out.
 * Env: RESEND_API_KEY=re_...  |  RESEND_FROM="hubrobe <noreply@yourdomain.com>" (or onboarding@resend.dev for tests)
 */
async function trySendResend(to, subject, html, logTag) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;

  const { Resend } = require("resend");
  const resend = new Resend(key);
  const from = (process.env.RESEND_FROM || "hubrobe <onboarding@resend.dev>").trim();

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  });

  if (error) {
    const msg = error.message || (typeof error === "string" ? error : JSON.stringify(error));
    throw new Error(msg);
  }

  console.log(`[${logTag}] Resend OK → ${to} id=${data?.id ?? "?"}`);
  return { messageId: data?.id };
}

async function sendViaSmtpHtml(to, subject, html, logTag) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    const errorMsg = `[${logTag}] Missing EMAIL_USER or EMAIL_PASS. No Brevo/Resend API key provided either. Cannot send email.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || `"hubrobe" <${user}>`,
    to,
    subject,
    html,
  };

  async function sendOnce(smtpHost) {
    console.log(`[${logTag}] Attempting SMTP via ${smtpHost} (port 587)...`);
    const transporter = createPooledGmailTransport(user, pass, smtpHost, 5);
    try {
      await transporter.verify();
      const info = await transporter.sendMail(mailOptions);
      await closeTransport(transporter);
      return info;
    } catch (err) {
      console.error(`[${logTag}] SMTP Attempt failed:`, err.message);
      await closeTransport(transporter).catch(() => {});
      throw err;
    }
  }

  try {
    const smtpHost = await getSmtpIpv4Address();
    const info = await sendOnce(smtpHost);
    console.log(`[${logTag}] SMTP SUCCESS → ${to} id=${info.messageId}`);
    return info;
  } catch (error) {
    if (!isRetryableSmtpError(error)) {
      console.error(`[${logTag}] SMTP FATAL ERROR for ${to}:`, error.message);
      throw error;
    }
    console.warn(`[${logTag}] SMTP RETRYING for ${to} due to:`, error.message);
    invalidateSmtpIpv4Cache();
    const smtpHost = await getSmtpIpv4Address();
    const info = await sendOnce(smtpHost);
    console.log(`[${logTag}] SMTP SUCCESS (on retry) → ${to} id=${info.messageId}`);
    return info;
  }
}

/** Full HTML body (e.g. already wrapped with emailLayout). */
async function sendTransactionalHtml(to, subject, html, logTag) {
  // 1. Try Brevo (Recommended for reliability in regions like Algeria)
  if (process.env.BREVO_API_KEY?.trim()) {
    try {
      return await trySendBrevo(to, subject, html, logTag);
    } catch (e) {
      console.error(`[${logTag}] Brevo failed:`, e.message);
    }
  }

  // 2. Try Resend
  if (process.env.RESEND_API_KEY?.trim()) {
    try {
      return await trySendResend(to, subject, html, logTag);
    } catch (e) {
      console.error(`[${logTag}] Resend failed, falling back to SMTP:`, e.message);
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw e;
      }
    }
  }

  // 3. Fallback to Gmail SMTP
  return sendViaSmtpHtml(to, subject, html, logTag);
}

async function sendSingleEmail(to, subject, htmlInner, logTag) {
  return sendTransactionalHtml(to, subject, emailLayout(htmlInner), logTag);
}

module.exports = {
  emailLayout,
  getSmtpIpv4Address,
  invalidateSmtpIpv4Cache,
  createPooledGmailTransport,
  closeTransport,
  isRetryableSmtpError,
  sendTransactionalHtml,
  sendSingleEmail,
};
