const {
  emailLayout,
  getSmtpIpv4Address,
  invalidateSmtpIpv4Cache,
  createPooledGmailTransport,
  closeTransport,
  sendSingleEmail,
  sendTransactionalHtml,
} = require("./mail.core");

function buildNewsletterTemplate(subject, content) {
  return {
    subject,
    html: `
      <div style="line-height: 1.6; color: #333;">
        ${content}
      </div>
    `,
  };
}

function buildBlogTemplate(blogTitle, blogDesc, blogId) {
  return {
    subject: `New on the Blog: ${blogTitle}`,
    html: `
      <h2 style="color: #000; margin-bottom: 15px;">${blogTitle}</h2>
      <p style="color: #444; line-height: 1.6; margin-bottom: 25px;">${blogDesc}</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://hubrobe.vercel.app/news/${blogId}" style="display: inline-block; background: #000; color: #fff; padding: 15px 35px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 13px; letter-spacing: 1px;">Read Full Article</a>
      </div>
    `,
  };
}

async function sendNewsletterEmail(email, subject, content) {
  const { subject: subj, html } = buildNewsletterTemplate(subject, content);
  return sendSingleEmail(email, subj, html, "NewsletterMail");
}

async function sendNewBlogEmail(email, blogTitle, blogDesc, blogId) {
  const { subject, html } = buildBlogTemplate(blogTitle, blogDesc, blogId);
  return sendSingleEmail(email, subject, html, "BlogMail");
}

async function sendNewsletterBulk(recipientEmails, subject, content) {
  const { subject: mailSubject, html: innerHtml } = buildNewsletterTemplate(subject, content);
  const html = emailLayout(innerHtml);

  const settled = [];
  for (let i = 0; i < recipientEmails.length; i++) {
    const to = recipientEmails[i];
    console.log(`[NewsletterMail] Attempting to send newsletter to: ${to}`);
    try {
      await sendTransactionalHtml(to, mailSubject, html, "NewsletterMail");
      settled.push({ status: "fulfilled", value: {} });
    } catch (err) {
      console.error(`[NewsletterMail] Failure: ${to}. Error:`, err.message);
      settled.push({ status: "rejected", reason: err });
    }
    // Rate limiting / pause between emails to avoid spam filters or API limits
    if (i < recipientEmails.length - 1) {
      await new Promise((r) => setTimeout(r, 450));
    }
  }
  return settled;
}

module.exports = {
  sendNewsletterEmail,
  sendNewsletterBulk,
  sendNewBlogEmail,
};
