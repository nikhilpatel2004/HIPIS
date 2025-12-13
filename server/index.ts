import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectDB } from "./config/database";
import { getAllResources, getResourceById, createResource, updateResourceLikes } from "./routes/resources";
import { getUserMoodEntries, createMoodEntry, deleteMoodEntry } from "./routes/wellness";
import { getUserAppointments, createAppointment, cancelAppointment } from "./routes/appointments";
import { getResourceComments, createComment } from "./routes/comments";
import { signup, login, getProfile } from "./routes/auth";
import {
  getForumPosts,
  createForumPost,
  likeForumPost,
  addForumReply,
  incrementForumView,
} from "./routes/forum";
import { getAssessments, createAssessment } from "./routes/assessments";
import { createContactRequest } from "./routes/support";
import { getNotifications, markAllRead, markOneRead } from "./routes/notifications";
import {
  getCounselorClients,
  getClientDetails,
  getCounselorAppointments,
  getUpcomingAppointments,
  createSessionNote,
  getRecentNotes,
  getCounselorStats,
  addClient
} from "./routes/counselor";
import {
  getAdminStats,
  getAllUsers,
  getWellnessMetrics,
  getAppointmentAnalytics,
  getResourceEngagement,
  getForumActivity,
  getHighRiskFlags,
  updateUserStatus,
  assignCounselor,
  getSystemAlerts
} from "./routes/admin";
import { authMiddleware } from "./middleware/auth";

// Admin middleware - check if user is admin
const adminMiddleware = (req: any, res: any, next: any) => {
  const userRole = req.userRole;
  if (!userRole || userRole !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

export function createServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required to start the server");
  }

  const defaultOrigins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:8083",
    "http://localhost:8084",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:8082",
    "http://127.0.0.1:8083",
    "http://127.0.0.1:8084",
    "http://localhost:*",
    "http://127.0.0.1:*",
  ];

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || defaultOrigins.join(","))
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const isAllowedOrigin = (origin?: string | null) => {
    if (!origin) return true;
    const normalized = origin.toLowerCase();

    // Exact match first.
    if (allowedOrigins.some((o) => !o.endsWith("*") && o.toLowerCase() === normalized)) {
      return true;
    }

    // Support wildcard ports like http://localhost:* to avoid CORS breaks when Vite picks a new port.
    const wildcardOrigins = allowedOrigins
      .filter((o) => o.endsWith("*"))
      .map((o) => o.slice(0, -1).toLowerCase());

    return wildcardOrigins.some((prefix) => normalized.startsWith(prefix));
  };

  const app = express();

  // Connect to MongoDB
  connectDB();

  // Middleware
  app.use(
    cors({
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth API (Public routes)
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.get("/api/auth/profile", authMiddleware, getProfile);

  // Resources API (Public)
  app.get("/api/resources", getAllResources);
  app.get("/api/resources/:id", getResourceById);
  app.post("/api/resources", authMiddleware, createResource);
  app.patch("/api/resources/:id/likes", updateResourceLikes);

  // Wellness/Mood API (Protected)
  app.get("/api/wellness/:userId", authMiddleware, getUserMoodEntries);
  app.post("/api/wellness", authMiddleware, createMoodEntry);
  app.delete("/api/wellness/:id", authMiddleware, deleteMoodEntry);

  // Appointments API (Protected)
  app.get("/api/appointments/:userId", authMiddleware, getUserAppointments);
  app.post("/api/appointments", authMiddleware, createAppointment);
  app.patch("/api/appointments/:id/cancel", authMiddleware, cancelAppointment);

  // Comments API
  app.get("/api/comments/:resourceId", getResourceComments);
  app.post("/api/comments", authMiddleware, createComment);

  // Assessments API (Protected)
  app.get("/api/assessments/:userId", authMiddleware, getAssessments);
  app.post("/api/assessments", authMiddleware, createAssessment);

  // Support contact (Protected)
  app.post("/api/support/contact", authMiddleware, createContactRequest);

  // Notifications (Protected)
  app.get("/api/notifications/:userId", authMiddleware, getNotifications);
  app.post("/api/notifications/:userId/read", authMiddleware, markAllRead);
  app.post("/api/notifications/read/:id", authMiddleware, markOneRead);

  // Forum API
  app.get("/api/forum", getForumPosts);
  app.post("/api/forum", authMiddleware, createForumPost);
  app.post("/api/forum/:id/like", authMiddleware, likeForumPost);
  app.post("/api/forum/:id/replies", authMiddleware, addForumReply);
  app.post("/api/forum/:id/view", incrementForumView);

  // Counselor API (Protected)
  app.get("/api/counselor/clients", authMiddleware, getCounselorClients);
  app.get("/api/counselor/clients/:clientId", authMiddleware, getClientDetails);
  app.get("/api/counselor/appointments/today", authMiddleware, getCounselorAppointments);
  app.get("/api/counselor/appointments/upcoming", authMiddleware, getUpcomingAppointments);
  app.post("/api/counselor/notes", authMiddleware, createSessionNote);
  app.get("/api/counselor/notes", authMiddleware, getRecentNotes);
  app.get("/api/counselor/stats", authMiddleware, getCounselorStats);
  app.post("/api/counselor/clients", authMiddleware, addClient);

  // Admin API (Protected - Admin only)
  app.use("/api/admin", authMiddleware, adminMiddleware);
  app.get("/api/admin/stats", getAdminStats);
  app.get("/api/admin/users", getAllUsers);
  app.get("/api/admin/wellness", getWellnessMetrics);
  app.get("/api/admin/appointments", getAppointmentAnalytics);
  app.get("/api/admin/resources", getResourceEngagement);
  app.get("/api/admin/forum", getForumActivity);
  app.get("/api/admin/flags", getHighRiskFlags);
  app.get("/api/admin/alerts", getSystemAlerts);
  app.patch("/api/admin/users/:userId/status", updateUserStatus);
  app.post("/api/admin/assign-counselor", assignCounselor);

  return app;
}
