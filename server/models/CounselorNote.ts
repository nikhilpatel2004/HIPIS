import mongoose from "mongoose";

const counselorNoteSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true
  },
  sessionDate: {
    type: Date,
    default: Date.now
  },
  followUp: {
    type: String,
    default: ""
  },
  keyPoints: [{
    type: String
  }],
  mood: {
    type: String,
    enum: ["Stable", "Improved", "Declined", "Crisis"],
    default: "Stable"
  }
}, {
  timestamps: true
});

export const CounselorNote = mongoose.models.CounselorNote || mongoose.model("CounselorNote", counselorNoteSchema);
