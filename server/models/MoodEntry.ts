import mongoose from "mongoose";

const moodEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  mood: { type: String, required: true },
  stress: { type: Number, required: true, min: 1, max: 10 },
  sleep: { type: Number, required: true, min: 0, max: 12 },
  energy: { type: Number, required: true, min: 1, max: 10 },
  exercise: { type: Boolean, default: false },
  notes: { type: String, default: "" }
}, { 
  timestamps: true 
});

export const MoodEntry = mongoose.models.MoodEntry || mongoose.model("MoodEntry", moodEntrySchema);
