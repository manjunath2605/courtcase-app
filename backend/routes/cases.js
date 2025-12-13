const router = require("express").Router();
const Case = require("../models/Case");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const filter = {};
  if (req.query.court) filter.court = req.query.court;
  if (req.query.status) filter.status = req.query.status;
  res.json(await Case.find(filter));
});

router.get("/today", auth, async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  res.json(await Case.find({ nextDate: today }));
});

router.post("/", auth, async (req, res) => {
  const c = new Case(req.body);
  await c.save();
  res.json(c);
});

router.get("/:id", auth, async (req, res) => {
  const caseData = await Case.findById(req.params.id);
  if (!caseData) return res.status(404).json({ msg: "Case not found" });
  res.json(caseData);
});


router.put("/:id", auth, async (req, res) => {
  const updated = await Case.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

router.delete("/:id", auth, async (req, res) => {
  try {
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
