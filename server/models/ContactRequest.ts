import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    source: { type: String, default: "assessments" },
    message: { type: String, default: "Please connect me with a counselor" },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

export const ContactRequest =
  mongoose.models.ContactRequest || mongoose.model("ContactRequest", contactRequestSchema);
