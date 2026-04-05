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
 * One transactional message (welcome, reset, single newsletter, blog) — same stack as newsletter bulk.
 */
async function sendSingleEmail(to, subject, htmlInner, logTag) {
  console.log(`[${logTag}] Attempting to send to: ${to}`);

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error(`[${logTag}] Missing EMAIL_USER or EMAIL_PASS`);
    throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
  }

  const mailOptions = {
    from: `"hubrobe" <${user}>`,
    to,
    subject,
    html: emailLayout(htmlInner),
  };

  async function sendOnce(smtpHost) {
    const transporter = createPooledGmailTransport(user, pass, smtpHost, 5);
    try {
      await transporter.verify();
      const info = await transporter.sendMail(mailOptions);
      await closeTransport(transporter);
      return info;
    } catch (err) {
      await closeTransport(transporter).catch(() => {});
      throw err;
    }
  }

  try {
    const smtpHost = await getSmtpIpv4Address();
    const info = await sendOnce(smtpHost);
    console.log(`[${logTag}] Success: sent to ${to}. ID: ${info.messageId}`);
    return info;
  } catch (error) {
    if (!isRetryableSmtpError(error)) {
      console.error(`[${logTag}] Failure: ${to}. Error:`, error.message);
      throw error;
    }
    console.error(`[${logTag}] Retry after failure (${to}):`, error.message);
    invalidateSmtpIpv4Cache();
    try {
      const smtpHost = await getSmtpIpv4Address();
      const info = await sendOnce(smtpHost);
      console.log(`[${logTag}] Success: sent to ${to}. ID: ${info.messageId}`);
      return info;
    } catch (err2) {
      console.error(`[${logTag}] Failure: ${to}. Error:`, err2.message);
      throw err2;
    }
  }
}

module.exports = {
  emailLayout,
  getSmtpIpv4Address,
  invalidateSmtpIpv4Cache,
  createPooledGmailTransport,
  closeTransport,
  isRetryableSmtpError,
  sendSingleEmail,
};
