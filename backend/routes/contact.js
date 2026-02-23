const router = require("express").Router();
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

    if (!emailSent) {
      return res.status(500).json({
        msg: "Contact delivery is not configured. Set email environment variables."
      });
    }

    res.json({
      msg: "Contact details submitted successfully",
      emailSent
    });
  } catch (err) {
    console.error("Contact submit failed:", err);
    res.status(500).json({ msg: "Failed to submit contact details" });
  }
});

module.exports = router;
