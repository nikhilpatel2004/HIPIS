import { RequestHandler } from "express";
import { z } from "zod";
import { Resource } from "../models/Resource";

const ResourceModel = Resource as any;

// Get all resources
export const getAllResources: RequestHandler = async (_req, res) => {
  try {
    const resources = await ResourceModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: resources });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ success: false, message: "Failed to fetch resources" });
  }
};

// Get single resource by ID
export const getResourceById: RequestHandler = async (req, res) => {
  try {
    const resource = await ResourceModel.findById(req.params.id);
    if (!resource) {
      res.status(404).json({ success: false, message: "Resource not found" });
      return;
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ success: false, message: "Failed to fetch resource" });
  }
};

const resourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(["stress", "anxiety", "depression", "sleep", "academic", "confidence"]),
  type: z.enum(["video", "article", "audio", "infographic"]),
  language: z.enum(["en", "hi"]),
  icon: z.string().optional(),
  duration: z.string().optional(),
  content: z.string().min(1),
  videoUrl: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  author: z.string().min(1),
  publishedDate: z.string().min(1),
});

const likeSchema = z.object({ increment: z.boolean().optional().default(true) });

// Create new resource
export const createResource: RequestHandler = async (req, res) => {
  try {
    const parsed = resourceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Invalid resource payload" });
      return;
    }

    const resource = new ResourceModel(parsed.data);
    await resource.save();
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({ success: false, message: "Failed to create resource" });
  }
};

// Update resource likes
export const updateResourceLikes: RequestHandler = async (req, res) => {
  try {
    const parsed = likeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Invalid like payload" });
      return;
    }

    const { increment } = parsed.data;
    const resource = await ResourceModel.findById(req.params.id);
    
    if (!resource) {
      res.status(404).json({ success: false, message: "Resource not found" });
      return;
    }
    
    resource.likes += increment ? 1 : -1;
    if (resource.likes < 0) resource.likes = 0;
    await resource.save();
    
    res.json({ success: true, data: resource });
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ success: false, message: "Failed to update likes" });
  }
};
