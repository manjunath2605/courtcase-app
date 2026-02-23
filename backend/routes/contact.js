const router = require("express").Router();
const twilio = require("twilio");
const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ msg: "name, email, phone, and message are required" });
    }

    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.CONTACT_EMAIL_TO || smtpUser;
    let emailSent = false;
    let smsSent = false;

    const text = [
      "We have recived enquiry from contact form on website:",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "",
      "Message:",
      message
    ].join("\n");

    if (emailTo && ((smtpUser && smtpPass) || resendApiKey)) {
      await sendEmail(emailTo, "New Contact Enquiry", text);
      emailSent = true;
    }

    const hasTwilioConfig =
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_PHONE &&
      process.env.CONTACT_PHONE_TO;

    if (hasTwilioConfig) {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        from: process.env.TWILIO_FROM_PHONE,
        to: process.env.CONTACT_PHONE_TO,
        body: `Contact: ${name}, ${phone}, ${email}. Msg: ${message}`.slice(0, 1600)
      });
      smsSent = true;
    }

    if (!emailSent && !smsSent) {
      return res.status(500).json({
        msg: "Contact delivery is not configured. Set email and/or Twilio env vars."
      });
    }

    res.json({
      msg: "Contact details submitted successfully",
      emailSent,
      smsSent
    });
  } catch (err) {
    console.error("Contact submit failed:", err);
    res.status(500).json({ msg: "Failed to submit contact details" });
  }
});

module.exports = router;
