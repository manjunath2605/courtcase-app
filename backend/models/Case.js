const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema({
  caseNo: String,
  court: String,
  partyName: String,
  partyEmail: String,
  partyPhone: String,
  status: String,
  nextDate: Date,
  remarks: String,
  other:String
});

module.exports = mongoose.model("Case", CaseSchema);
