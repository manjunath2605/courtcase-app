const router = require("express").Router();
const Case = require("../models/Case");
const auth = require("../middleware/auth");

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
  const shouldBootstrapHistory = history.length === 0 && Boolean(entry);

  if (entry && (hearingChanged || shouldBootstrapHistory) && !isSameHistoryEntry(latest, entry)) {
    history.push(entry);
  }

  existing.history = history;
  await existing.save();
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
