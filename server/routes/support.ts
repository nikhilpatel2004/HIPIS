import { RequestHandler } from "express";
import { z } from "zod";
import { ContactRequest } from "../models/ContactRequest";
import { User } from "../models/User";
import { createNotification } from "../utils/notifications";

const contactSchema = z.object({
  message: z.string().min(1).max(500).optional(),
  source: z.string().optional(),
});

export const createContactRequest: RequestHandler = async (req: any, res) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Invalid contact payload" });
    }

    const { message = "Please connect me with a counselor", source = "assessments" } = parsed.data;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await (User as any).findById(userId).lean();

    const request = new ContactRequest({
      userId,
      name: user?.name,
      email: user?.email,
      source,
      message,
    });

    await request.save();
    // Notify user confirmation
    await createNotification({
      userId,
      title: "Counselor request received",
      message: "We'll connect you to a counselor shortly.",
      type: "support",
      link: "/assessments",
    });
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error("Error creating contact request:", error);
    res.status(500).json({ success: false, message: "Failed to create contact request" });
  }
};
