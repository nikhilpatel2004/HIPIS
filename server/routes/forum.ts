import { Request, RequestHandler } from "express";
import { z } from "zod";
import { ForumPost } from "../models/ForumPost";
import { User } from "../models/User";

type AuthedRequest = Request & { userId?: string };

const ForumPostModel = ForumPost as any;
const UserModel = User as any;

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  anonymous: z.boolean().optional(),
});

const replySchema = z.object({
  content: z.string().min(1),
  anonymous: z.boolean().optional(),
});

export const getForumPosts: RequestHandler = async (req, res) => {
  try {
    const { category = "all", q = "", sort = "recent" } = req.query as Record<string, string>;

    const filter: Record<string, any> = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    const sortMap: Record<string, any> = {
      recent: { createdAt: -1 },
      popular: { likes: -1 },
      active: { updatedAt: -1 },
    };

    const posts = await ForumPostModel.find(filter)
      .sort(sortMap[sort] ?? sortMap.recent)
      .lean();

    res.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch forum posts" });
  }
};

export const createForumPost: RequestHandler = async (req, res) => {
  try {
    const parsed = postSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Invalid post payload" });
    }

    const { title, content, category, tags = [], anonymous = true } = parsed.data;

    let authorName = "Anonymous";
    const authedReq = req as AuthedRequest;

    if (!anonymous && authedReq.userId) {
      const user = await UserModel.findById(authedReq.userId).lean();
      authorName = user?.name ?? "Member";
    }

    const post = new ForumPost({
      title,
      content,
      category: category || "stress",
      tags,
      anonymous,
      authorId: authedReq.userId,
      authorName,
      views: 1,
    });

    const saved = await post.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error("Error creating forum post:", error);
    res.status(500).json({ success: false, message: "Failed to create forum post" });
  }
};

export const likeForumPost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ForumPostModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error liking forum post:", error);
    res.status(500).json({ success: false, message: "Failed to like post" });
  }
};

export const addForumReply: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const parsed = replySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Invalid reply payload" });
    }

    const { content, anonymous = true } = parsed.data;

    let authorName = "Anonymous";
    const authedReq = req as AuthedRequest;

    if (!anonymous && authedReq.userId) {
      const user = await UserModel.findById(authedReq.userId).lean();
      authorName = user?.name ?? "Member";
    }

    const updated = await ForumPostModel.findByIdAndUpdate(
      id,
      {
        $push: {
          replies: {
            content,
            anonymous,
            authorName,
            userId: authedReq.userId,
          },
        },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error adding forum reply:", error);
    res.status(500).json({ success: false, message: "Failed to add reply" });
  }
};

export const incrementForumView: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ForumPostModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error incrementing forum view:", error);
    res.status(500).json({ success: false, message: "Failed to increment view" });
  }
};
