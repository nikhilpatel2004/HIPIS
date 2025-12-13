import { Request, RequestHandler } from "express";
import { z } from "zod";
import { Assessment } from "../models/Assessment";
import { createNotification } from "../utils/notifications";

type AuthedRequest = Request & { userId?: string; userRole?: string };

const AssessmentModel = Assessment as any;

const assessmentSchema = z.object({
  type: z.enum(["PHQ-9", "GAD-7", "GHQ-12"]),
  score: z.number(),
  severity: z.string().min(1),
  interpretation: z.string().min(1),
  recommendations: z.array(z.string()).optional(),
  answers: z.array(z.number()).optional(),
});

// Get assessments for a user
export const getAssessments: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const requester = req as AuthedRequest;

    if (requester.userRole !== "admin" && requester.userId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const assessments = await AssessmentModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: assessments });
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch assessments" });
  }
};

// Create a new assessment result
export const createAssessment: RequestHandler = async (req, res) => {
  try {
    const authedReq = req as AuthedRequest;
    const parsed = assessmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Invalid assessment payload" });
    }

    const { type, score, severity, interpretation, recommendations = [], answers = [] } = parsed.data;

    const assessment = new AssessmentModel({
      userId: authedReq.userId,
      type,
      score,
      severity,
      interpretation,
      recommendations,
      answers,
    });

    await assessment.save();
    // Notify user
    if (authedReq.userId) {
      await createNotification({
        userId: authedReq.userId,
        title: `${type} assessment saved`,
        message: `Score: ${score}, Severity: ${severity}`,
        type: "assessment",
        link: "/assessments",
      });
    }
    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    console.error("Error creating assessment:", error);
    res.status(500).json({ success: false, message: "Failed to create assessment" });
  }
};
