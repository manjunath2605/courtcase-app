const nodemailer = require("nodemailer");

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
  await verifyTransporter();
  await transporter.sendMail({
    from: `"Court Case App" <${process.env.EMAIL_FROM || smtpUser}>`,
    to,
    subject,
    text: message,
    ...(html ? { html } : {}),
    ...(attachments.length ? { attachments } : {})
  });
};
