const mongoose = require("mongoose");

const HistoryEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, required: true },
  court: { type: String, default: "" },
  remarks: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: "System" }
});

const CaseSchema = new mongoose.Schema({
  caseNo: String,
  court: String,
  partyName: String,
  partyEmail: String,
  partyPhone: String,
  clientAccessCodeHash: {
    type: String,
    select: false
  },
  status: String,
  nextDate: Date,
  remarks: String,
  other: String,
  history: [HistoryEntrySchema]
});

module.exports = mongoose.model("Case", CaseSchema);
