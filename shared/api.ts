/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * User Roles
 */
export type UserRole = "student" | "counsellor" | "admin";

/**
 * User Profile
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university: string;
  createdAt: string;
  language?: "en" | "hi";
}

/**
 * Authentication Response
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Appointment
 */
export interface Appointment {
  id: string;
  studentId: string;
  counsellorId: string;
  startTime: string;
  endTime: string;
  type: "video-call" | "in-person" | "phone";
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

/**
 * Mood Log
 */
export interface MoodLog {
  id: string;
  userId: string;
  mood: "😢" | "😟" | "😐" | "🙂" | "😊";
  stressLevel: number; // 1-10
  notes?: string;
  timestamp: string;
}

/**
 * Assessment (PHQ-9, GAD-7, GHQ-12)
 */
export interface Assessment {
  id: string;
  userId: string;
  type: "phq9" | "gad7" | "ghq12";
  score: number;
  severity: "minimal" | "mild" | "moderate" | "severe";
  completedAt: string;
}

/**
 * Forum Post
 */
export interface ForumPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  category: "stress" | "anxiety" | "depression" | "academics" | "sleep" | "general";
  anonymous: boolean;
  likes: number;
  replies: number;
  createdAt: string;
}

/**
 * Wellness Resource
 */
export interface Resource {
  id: string;
  title: string;
  description: string;
  category: "stress" | "anxiety" | "depression" | "sleep" | "academic" | "confidence";
  type: "video" | "article" | "audio" | "infographic";
  language: "en" | "hi";
  url: string;
  createdAt: string;
}

/**
 * Chatbot Message
 */
export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  sentiment?: "positive" | "neutral" | "negative";
  riskLevel?: "low" | "medium" | "high";
  timestamp: string;
  role: "user" | "assistant";
}

/**
 * Analytics Log (for admin dashboard)
 */
export interface AnalyticsLog {
  id: string;
  eventType: "chat" | "appointment" | "assessment" | "resource_view" | "forum_post";
  userId: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}
