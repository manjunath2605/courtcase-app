const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (to, subject, message, html, attachments = []) => {
  await transporter.sendMail({
    from: `"Court Case App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message,
    ...(html ? { html } : {}),
    ...(attachments.length ? { attachments } : {})
  });
};
