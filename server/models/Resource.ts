import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ["stress", "anxiety", "depression", "sleep", "academic", "confidence"]
  },
  type: { 
    type: String, 
    required: true,
    enum: ["video", "article", "audio", "infographic"]
  },
  language: { 
    type: String, 
    required: true,
    enum: ["en", "hi"],
    default: "en"
  },
  icon: { type: String, default: "📚" },
  duration: String,
  likes: { type: Number, default: 0 },
  content: { type: String, required: true },
  videoUrl: String,
  audioUrl: String,
  imageUrl: String,
  author: { type: String, required: true },
  publishedDate: { type: String, required: true }
}, { 
  timestamps: true 
});

export const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
