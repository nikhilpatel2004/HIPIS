import mongoose from "mongoose";

const counselorClientSchema = new mongoose.Schema({
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  primaryIssue: {
    type: String,
    enum: ["Anxiety", "Depression", "Stress", "Family Issues", "Sleep Issues", "Academic", "Relationship", "Other"],
    required: true
  },
  status: {
    type: String,
    enum: ["active", "completed", "paused"],
    default: "active"
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  lastSessionDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

export const CounselorClient = mongoose.models.CounselorClient || mongoose.model("CounselorClient", counselorClientSchema);
