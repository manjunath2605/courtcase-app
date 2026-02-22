const router = require("express").Router();
const Case = require("../models/Case");
const auth = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");
const fs = require("fs");
const path = require("path");

const normalizeDateKey = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const buildHistoryEntry = (caseData, userId) => {
  if (!caseData?.nextDate || !caseData?.status) return null;

  const date = new Date(caseData.nextDate);
  if (Number.isNaN(date.getTime())) return null;

  return {
    date,
    status: caseData.status,
    court: caseData.court || "",
    remarks: caseData.remarks || "",
    createdBy: userId || "System"
  };
};

const isSameHistoryEntry = (a, b) =>
  normalizeDateKey(a?.date) === normalizeDateKey(b?.date) &&
  (a?.status || "") === (b?.status || "") &&
  (a?.court || "") === (b?.court || "") &&
  (a?.remarks || "") === (b?.remarks || "");

const hasHearingChange = (beforeCase, afterCase) =>
  normalizeDateKey(beforeCase?.nextDate) !== normalizeDateKey(afterCase?.nextDate) ||
  (beforeCase?.status || "") !== (afterCase?.status || "") ||
  (beforeCase?.court || "") !== (afterCase?.court || "") ||
  (beforeCase?.remarks || "") !== (afterCase?.remarks || "");

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

router.get("/", auth, async (req, res) => {
  const filter = {};
  if (req.user?.role === "client") {
    filter.partyEmail = { $regex: `^${String(req.user.email || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" };
  }
  if (req.query.court) filter.court = req.query.court;
  if (req.query.status) filter.status = req.query.status;
  res.json(await Case.find(filter));
});

router.get("/today", auth, async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const filter = { nextDate: today };
  if (req.user?.role === "client") {
    filter.partyEmail = { $regex: `^${String(req.user.email || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" };
  }
  res.json(await Case.find(filter));
});

router.post("/", auth, async (req, res) => {
  if (req.user?.role === "client") {
    return res.status(403).json({ msg: "Client is read-only" });
  }

  const c = new Case(req.body);

  const history = Array.isArray(c.history) ? c.history : [];
  const entry = buildHistoryEntry(c, req.user?.id);
  const latest = history[history.length - 1];

  if (entry && !isSameHistoryEntry(latest, entry)) {
    history.push(entry);
  }

  c.history = history;
  await c.save();
  res.json(c);
});

router.get("/:id", auth, async (req, res) => {
  const caseData = await Case.findById(req.params.id);
  if (!caseData) return res.status(404).json({ msg: "Case not found" });

  if (
    req.user?.role === "client" &&
    String(caseData.partyEmail || "").toLowerCase() !== String(req.user.email || "").toLowerCase()
  ) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  res.json(caseData);
});


router.put("/:id", auth, async (req, res) => {
  if (req.user?.role === "client") {
    return res.status(403).json({ msg: "Client is read-only" });
  }

  const existing = await Case.findById(req.params.id);
  if (!existing) return res.status(404).json({ msg: "Case not found" });

  const updates = { ...req.body };
  delete updates._id;
  delete updates.__v;
  delete updates.history;

  const beforeUpdate = {
    nextDate: existing.nextDate,
    status: existing.status,
    court: existing.court,
    remarks: existing.remarks
  };

  Object.assign(existing, updates);

  const history = Array.isArray(existing.history) ? [...existing.history] : [];
  const entry = buildHistoryEntry(existing, req.user?.id);
  const latest = history[history.length - 1];
  const hearingChanged = hasHearingChange(beforeUpdate, existing);
  const nextDateChanged =
    normalizeDateKey(beforeUpdate?.nextDate) !== normalizeDateKey(existing?.nextDate);
  const shouldBootstrapHistory = history.length === 0 && Boolean(entry);

  if (entry && (hearingChanged || shouldBootstrapHistory) && !isSameHistoryEntry(latest, entry)) {
    history.push(entry);
  }

  existing.history = history;
  await existing.save();

  // Notify client only when next hearing date changes.
  if (nextDateChanged && existing.partyEmail) {
    const to = String(existing.partyEmail || "").trim();
    const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to);

    if (hasValidEmail) {
      const oldDate = normalizeDateKey(beforeUpdate.nextDate) || "-";
      const nextDate = normalizeDateKey(existing.nextDate) || "-";
      const caseNo = existing.caseNo || "-";
      const status = existing.status || "-";
      const remarks = existing.remarks || "-";
      const court = existing.court || "-";
      const partyName = existing.partyName || "Client";

      const subject = `Case Update: Next Hearing Date Updated (Case ${caseNo})`;
      const hearingImagePath = path.resolve(__dirname, "../../frontend/src/assets/hearing_update.png");
      const hasHearingImage = fs.existsSync(hearingImagePath);
      const bannerUrl = String(process.env.HEARING_EMAIL_BANNER_URL || "").trim();
      const useRemoteBanner = /^https?:\/\//i.test(bannerUrl);
      const text = [
        `Dear ${partyName},`,
        "",
        "Your next hearing date has been updated.",
        "Please be available on that day.",
        "",
        "Case Details:",
        `Case No: ${caseNo}`,
        `Old Hearing Date: ${oldDate}`,
        `Next Hearing Date: ${nextDate}`,
        `Status: ${status}`,
        `Remarks: ${remarks}`,
        `Court: ${court}`,
        "",
        "Regards,",
        "SVPG Team"
      ].join("\n");

      const bannerBlock = useRemoteBanner
        ? `<div style="margin-bottom: 14px;">
            <img
              src="${escapeHtml(bannerUrl)}"
              alt="Your Next Hearing Update"
              style="width: 100%; max-width: 620px; height: auto; display: block; border-radius: 8px;"
            />
          </div>`
        : hasHearingImage
        ? `<div style="margin-bottom: 14px;">
            <img
              src="cid:hearing-update-image"
              alt="Your Next Hearing Update"
              style="width: 100%; max-width: 620px; height: auto; display: block; border-radius: 8px;"
            />
          </div>`
        : "";

      const html = `
        <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
          ${bannerBlock}
          <p>Dear ${escapeHtml(partyName)},</p>
          <p>Your next hearing date has been updated.</p>
          <p><strong>Please be available on that day.</strong></p>
          <table style="border-collapse: collapse; width: 100%; max-width: 620px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="border: 1px solid #d1d5db; text-align: left; padding: 8px;">Field</th>
                <th style="border: 1px solid #d1d5db; text-align: left; padding: 8px;">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 8px;">Case No.</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${escapeHtml(caseNo)}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 8px;">Old Hearing Date</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${escapeHtml(oldDate)}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 8px;">Next Hearing Date</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${escapeHtml(nextDate)}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 8px;">Status</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${escapeHtml(status)}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 8px;">Remarks</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${escapeHtml(remarks)}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 8px;">Court</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${escapeHtml(court)}</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 14px;">Regards,<br/>SVPJ Team</p>
        </div>
      `;

      const attachments = !useRemoteBanner && hasHearingImage
        ? [
            {
              filename: "hearing_update.png",
              path: hearingImagePath,
              cid: "hearing-update-image"
            }
          ]
        : [];

      // Send email in background so case update response is not delayed.
      sendEmail(to, subject, text, html, attachments).catch((emailErr) => {
        console.error("Failed to send next hearing update email:", emailErr);
      });
    }
  }

  res.json(existing);
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user?.role === "client")
      return res.status(403).json({ msg: "Client is read-only" });

    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Admin only" });

    await Case.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Case deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
