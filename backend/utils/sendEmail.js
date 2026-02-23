const nodemailer = require("nodemailer");

const resendApiKey = String(process.env.RESEND_API_KEY || "").trim();
const resendApiUrl = process.env.RESEND_API_URL || "https://api.resend.com/emails";
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
const smtpSecure =
  String(process.env.SMTP_SECURE ?? (smtpPort === 465 ? "true" : "false")).toLowerCase() === "true";

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: !smtpSecure,
  // Prevent route handlers from hanging for too long if SMTP is slow/unreachable.
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 12000,
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

let verified = false;
const verifyTransporter = async () => {
  if (verified) return;
  await transporter.verify();
  verified = true;
  console.log(`SMTP ready: ${smtpHost}:${smtpPort} secure=${smtpSecure}`);
};

module.exports = async (to, subject, message, html, attachments = []) => {
  const from = process.env.EMAIL_FROM || smtpUser;

  // Prefer HTTPS email API on hosted servers where SMTP can time out.
  if (resendApiKey && attachments.length === 0) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(resendApiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text: message,
          ...(html ? { html } : {})
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const body = await response.text();
        const err = new Error(`Resend API failed: ${response.status} ${body}`);
        err.code = "ERESEND";
        throw err;
      }
      return;
    } finally {
      clearTimeout(timer);
    }
  }

  await verifyTransporter();
  await transporter.sendMail({
    from: `"Court Case App" <${from}>`,
    to,
    subject,
    text: message,
    ...(html ? { html } : {}),
    ...(attachments.length ? { attachments } : {})
  });
};
