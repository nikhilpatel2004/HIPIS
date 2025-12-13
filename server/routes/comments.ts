import { RequestHandler } from "express";
import { z } from "zod";
import { Comment } from "../models/Comment";

const commentSchema = z.object({
  resourceId: z.string().min(1),
  author: z.string().min(1),
  text: z.string().min(1),
  timestamp: z.string().optional(),
});

// Get comments for a resource
export const getResourceComments: RequestHandler = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const comments = await Comment.find({ resourceId }).sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch comments" });
  }
};

// Create new comment
export const createComment: RequestHandler = async (req, res) => {
  try {
    const parsed = commentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Invalid comment payload" });
    }

    const payload = {
      ...parsed.data,
      timestamp: parsed.data.timestamp || new Date().toISOString(),
    };

    const comment = new Comment(payload);
    await comment.save();
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: "Failed to create comment" });
  }
};
