import { RequestHandler } from "express";
import { z } from "zod";
import { MoodEntry } from "../models/MoodEntry";

const moodEntrySchema = z.object({
  userId: z.string().min(1),
  date: z.string().min(1),
  mood: z.string().min(1),
  stress: z.number().int().min(1).max(10),
  sleep: z.number().min(0).max(24),
  energy: z.number().int().min(1).max(10),
  exercise: z.boolean().optional(),
  notes: z.string().optional(),
});

// Get all mood entries for a user
export const getUserMoodEntries: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const requester: any = req;

    if (requester.userRole !== "admin" && requester.userId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const entries = await (MoodEntry.find({ userId } as any) as any).sort({ createdAt: -1 });
    res.json({ success: true, data: entries });
  } catch (error) {
    console.error("Error fetching mood entries:", error);
    res.status(500).json({ success: false, message: "Failed to fetch mood entries" });
  }
};

// Create new mood entry
export const createMoodEntry: RequestHandler = async (req, res) => {
  try {
    const requester: any = req;
    const parsed = moodEntrySchema.safeParse({ ...req.body, userId: requester.userId || req.body.userId });
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Invalid mood entry payload" });
    }

    const entry = new MoodEntry(parsed.data);
    await entry.save();
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    console.error("Error creating mood entry:", error);
    res.status(500).json({ success: false, message: "Failed to create mood entry" });
  }
};

// Delete mood entry
export const deleteMoodEntry: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const requester: any = req;
    const entry = await (MoodEntry as any).findById(id);
    if (!entry) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const isOwner = requester.userId && entry.userId === requester.userId;
    const isAdmin = requester.userRole === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await (MoodEntry as any).findByIdAndDelete(id);
    res.json({ success: true, message: "Mood entry deleted" });
  } catch (error) {
    console.error("Error deleting mood entry:", error);
    res.status(500).json({ success: false, message: "Failed to delete mood entry" });
  }
};
