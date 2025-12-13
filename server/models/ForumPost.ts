import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    authorName: { type: String, default: "Anonymous" },
    anonymous: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const forumPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["stress", "anxiety", "depression", "academic", "sleep", "motivation", "other"],
      default: "stress",
    },
    tags: { type: [String], default: [] },
    anonymous: { type: Boolean, default: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String, default: "Anonymous" },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    replies: { type: [replySchema], default: [] },
  },
  { timestamps: true }
);

export const ForumPost = mongoose.models.ForumPost || mongoose.model("ForumPost", forumPostSchema);
