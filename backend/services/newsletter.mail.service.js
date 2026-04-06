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

  if (process.env.RESEND_API_KEY?.trim()) {
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
      if (i < recipientEmails.length - 1) {
        await new Promise((r) => setTimeout(r, 450));
      }
    }
    return settled;
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS (or set RESEND_API_KEY for newsletter).");
  }

  async function sendWithHost(smtpHost) {
    const transporter = createPooledGmailTransport(user, pass, smtpHost, 500);

    const settled = [];
    try {
      await transporter.verify();
      for (let i = 0; i < recipientEmails.length; i++) {
        const to = recipientEmails[i];
        console.log(`[NewsletterMail] Attempting to send newsletter to: ${to}`);
        try {
          const info = await transporter.sendMail({
            from: `"hubrobe" <${user}>`,
            to,
            subject: mailSubject,
            html,
          });
          console.log(`[NewsletterMail] Success: sent to ${to}. ID: ${info.messageId}`);
          settled.push({ status: "fulfilled", value: info });
        } catch (err) {
          console.error(`[NewsletterMail] Failure: ${to}. Error:`, err.message);
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

module.exports = {
  sendNewsletterEmail,
  sendNewsletterBulk,
  sendNewBlogEmail,
};
