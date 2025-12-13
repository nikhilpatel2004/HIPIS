import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  resourceId: { type: String, required: true },
  author: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true }
}, { 
  timestamps: true 
});

export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
