import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["PHQ-9", "GAD-7", "GHQ-12"], required: true },
    score: { type: Number, required: true },
    severity: { type: String, required: true },
    interpretation: { type: String, required: true },
    recommendations: { type: [String], default: [] },
    answers: { type: [Number], default: [] },
  },
  { timestamps: true }
);

export const Assessment = mongoose.models.Assessment || mongoose.model("Assessment", assessmentSchema);
