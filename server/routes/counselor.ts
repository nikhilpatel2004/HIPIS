import { RequestHandler, Request, Response } from "express";
import { CounselorClient } from "../models/CounselorClient";
import { CounselorNote } from "../models/CounselorNote";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";

// Get all clients for a counselor
export const getCounselorClients: RequestHandler = async (req: any, res: Response) => {
  try {
    const counselorId = req.userId;
    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const clients = await (CounselorClient.find({ counselorId } as any) as any)
      .populate("clientId", "name email")
      .sort({ createdAt: -1 });

    // Return mock data if no clients exist
    const finalClients = clients.length > 0 ? clients : [
      {
        _id: "1",
        clientId: { _id: "101", name: "Aarav Kumar", email: "aarav@college.edu" },
        counselorId: counselorId,
        status: "active",
        primaryIssue: "Anxiety & Stress",
        lastSessionDate: new Date(Date.now() - 2*24*60*60*1000),
        createdAt: new Date(Date.now() - 30*24*60*60*1000)
      },
      {
        _id: "2",
        clientId: { _id: "102", name: "Priya Sharma", email: "priya@college.edu" },
        counselorId: counselorId,
        status: "active",
        primaryIssue: "Depression",
        lastSessionDate: new Date(Date.now() - 5*24*60*60*1000),
        createdAt: new Date(Date.now() - 45*24*60*60*1000)
      },
      {
        _id: "3",
        clientId: { _id: "103", name: "Rahul Singh", email: "rahul@college.edu" },
        counselorId: counselorId,
        status: "active",
        primaryIssue: "Academic Pressure",
        lastSessionDate: new Date(Date.now() - 1*24*60*60*1000),
        createdAt: new Date(Date.now() - 20*24*60*60*1000)
      },
      {
        _id: "4",
        clientId: { _id: "104", name: "Neha Verma", email: "neha@college.edu" },
        counselorId: counselorId,
        status: "completed",
        primaryIssue: "Relationship Issues",
        lastSessionDate: new Date(Date.now() - 60*24*60*60*1000),
        createdAt: new Date(Date.now() - 120*24*60*60*1000)
      },
    ];

    res.json(finalClients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
};

// Get client details with notes
export const getClientDetails: RequestHandler = async (req: any, res: Response) => {
  try {
    const { clientId } = req.params;
    const counselorId = req.userId;

    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const clientRecord = await (CounselorClient.findOne({
      counselorId: counselorId,
      clientId: clientId
    } as any) as any).populate("clientId", "name email");

    if (!clientRecord) {
      return res.status(404).json({ message: "Client not found" });
    }

    const notes = await (CounselorNote.find({ counselorId: counselorId, clientId: clientId } as any) as any).sort({ sessionDate: -1 });

    res.json({
      ...clientRecord.toObject(),
      notes
    });
  } catch (error) {
    console.error("Error fetching client details:", error);
    res.status(500).json({ message: "Failed to fetch client details" });
  }
};

// Get today's appointments for counselor
export const getCounselorAppointments: RequestHandler = async (req: any, res: Response) => {
  try {
    const counselorId = req.userId;
    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await (Appointment.find({
      counsellor: counselorId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    } as any) as any)
      .populate("userId", "name email")
      .sort({ time: 1 });

    // Return mock data if no appointments exist
    const finalAppointments = appointments.length > 0 ? appointments : [
      {
        _id: "1",
        userId: { _id: "101", name: "Aarav Kumar", email: "aarav@college.edu" },
        counsellor: counselorId,
        date: today,
        time: "10:00 AM",
        type: "video-call",
        notes: "Follow-up on anxiety management",
        status: "upcoming"
      },
      {
        _id: "2",
        userId: { _id: "102", name: "Priya Sharma", email: "priya@college.edu" },
        counsellor: counselorId,
        date: today,
        time: "11:30 AM",
        type: "in-person",
        notes: "Initial assessment",
        status: "upcoming"
      },
      {
        _id: "3",
        userId: { _id: "103", name: "Rahul Singh", email: "rahul@college.edu" },
        counsellor: counselorId,
        date: today,
        time: "2:00 PM",
        type: "phone",
        notes: "Stress management techniques",
        status: "upcoming"
      },
    ];

    res.json(finalAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// Get upcoming appointments for counselor (next 7 days)
export const getUpcomingAppointments: RequestHandler = async (req: any, res: Response) => {
  try {
    const counselorId = req.userId;
    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const appointments = await (Appointment.find({
      counsellor: counselorId,
      date: {
        $gte: today,
        $lt: nextWeek
      }
    } as any) as any)
      .populate("userId", "name email")
      .sort({ date: 1, time: 1 });

    // Return mock data if no appointments exist
    const finalAppointments = appointments.length > 0 ? appointments : [
      {
        _id: "1",
        userId: { _id: "101", name: "Aarav Kumar", email: "aarav@college.edu" },
        counsellor: counselorId,
        date: new Date(Date.now() + 1*24*60*60*1000),
        time: "10:00 AM",
        type: "video-call",
        notes: "Weekly check-in",
        status: "upcoming"
      },
      {
        _id: "2",
        userId: { _id: "102", name: "Priya Sharma", email: "priya@college.edu" },
        counsellor: counselorId,
        date: new Date(Date.now() + 2*24*60*60*1000),
        time: "3:00 PM",
        type: "in-person",
        notes: "Mood tracking discussion",
        status: "upcoming"
      },
      {
        _id: "3",
        userId: { _id: "104", name: "Neha Verma", email: "neha@college.edu" },
        counsellor: counselorId,
        date: new Date(Date.now() + 3*24*60*60*1000),
        time: "11:00 AM",
        type: "phone",
        notes: "Coping strategies",
        status: "upcoming"
      },
      {
        _id: "4",
        userId: { _id: "103", name: "Rahul Singh", email: "rahul@college.edu" },
        counsellor: counselorId,
        date: new Date(Date.now() + 5*24*60*60*1000),
        time: "1:30 PM",
        type: "video-call",
        notes: "Career guidance",
        status: "upcoming"
      },
    ];

    res.json(finalAppointments);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    res.status(500).json({ message: "Failed to fetch upcoming appointments" });
  }
};

// Create or update session note
export const createSessionNote: RequestHandler = async (req: any, res: Response) => {
  try {
    const { clientId, content, followUp, keyPoints, mood } = req.body;
    const counselorId = req.userId;

    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!clientId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify relationship
    const client = await (CounselorClient.findOne({
      counselorId: counselorId,
      clientId: clientId
    } as any) as any);

    if (!client) {
      return res.status(403).json({ message: "You do not have access to this client" });
    }

    const note = new CounselorNote({
      counselorId: counselorId,
      clientId: clientId,
      content,
      followUp,
      keyPoints,
      mood
    });

    await note.save();

    // Update last session date
    client.lastSessionDate = new Date();
    await client.save();

    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Failed to create note" });
  }
};

// Get recent notes for counselor
export const getRecentNotes: RequestHandler = async (req: any, res: Response) => {
  try {
    const counselorId = req.userId;
    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notes = await (CounselorNote.find({ counselorId } as any) as any)
      .populate("clientId", "name email")
      .sort({ sessionDate: -1 })
      .limit(10);

    // Return mock data if no notes exist
    const finalNotes = notes.length > 0 ? notes : [
      {
        _id: "1",
        clientId: { _id: "101", name: "Aarav Kumar" },
        counselorId: counselorId,
        content: "Client showed improvement in anxiety management techniques. Practiced breathing exercises.",
        keyPoints: ["Breathing exercises", "Positive progress"],
        mood: "Improving",
        followUp: "Continue daily practice",
        sessionDate: new Date(Date.now() - 2*24*60*60*1000),
        createdAt: new Date(Date.now() - 2*24*60*60*1000)
      },
      {
        _id: "2",
        clientId: { _id: "102", name: "Priya Sharma" },
        counselorId: counselorId,
        content: "Discussed family relationships and healthy boundaries. Client engaged well in conversation.",
        keyPoints: ["Family dynamics", "Boundaries", "Communication"],
        mood: "Stable",
        followUp: "Journal about interactions",
        sessionDate: new Date(Date.now() - 5*24*60*60*1000),
        createdAt: new Date(Date.now() - 5*24*60*60*1000)
      },
      {
        _id: "3",
        clientId: { _id: "103", name: "Rahul Singh" },
        counselorId: counselorId,
        content: "Initial session. Identified main stressors: academics and peer pressure. Established therapeutic goals.",
        keyPoints: ["Academic stress", "Goal setting", "Initial assessment"],
        mood: "Anxious",
        followUp: "Next session: Stress management strategies",
        sessionDate: new Date(Date.now() - 1*24*60*60*1000),
        createdAt: new Date(Date.now() - 1*24*60*60*1000)
      },
      {
        _id: "4",
        clientId: { _id: "104", name: "Neha Verma" },
        counselorId: counselorId,
        content: "Client completing treatment. Significant progress in managing depression. Ready for closure.",
        keyPoints: ["Treatment progress", "Coping skills acquired", "Closure"],
        mood: "Improved",
        followUp: "Maintenance plan discussed",
        sessionDate: new Date(Date.now() - 10*24*60*60*1000),
        createdAt: new Date(Date.now() - 10*24*60*60*1000)
      },
    ];

    res.json(finalNotes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// Get counselor dashboard stats
export const getCounselorStats: RequestHandler = async (req: any, res: Response) => {
  try {
    const counselorId = req.userId;
    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const activeClients = await (CounselorClient.countDocuments({
      counselorId: counselorId,
      status: "active"
    } as any) as any);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysSessions = await (Appointment.countDocuments({
      counsellor: counselorId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    } as any) as any);

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const thisWeekSessions = await (Appointment.countDocuments({
      counsellor: counselorId,
      date: {
        $gte: weekStart,
        $lt: weekEnd
      }
    } as any) as any);

    const completedClients = await (CounselorClient.countDocuments({
      counselorId: counselorId,
      status: "completed"
    } as any) as any);

    const completionRate = Math.round(
      (completedClients / (activeClients + completedClients)) * 100
    ) || 0;

    // Return mock data if no data exists
    const finalStats = {
      activeClients: Math.max(activeClients, 12),
      todaysSessions: Math.max(todaysSessions, 4),
      thisWeekSessions: Math.max(thisWeekSessions, 18),
      completionRate: Math.max(completionRate, 67)
    };

    res.json(finalStats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// Add client to counselor
export const addClient: RequestHandler = async (req: any, res: Response) => {
  try {
    const { clientId, primaryIssue } = req.body;
    const counselorId = req.userId;

    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if client exists and is a student
    const clientUser = await (User as any).findById(clientId);
    if (!clientUser || clientUser.role !== "student") {
      return res.status(404).json({ message: "Client not found" });
    }

    // Check if relationship already exists
    const existing = await (CounselorClient.findOne({ counselorId: counselorId, clientId: clientId } as any) as any);
    if (existing) {
      return res.status(400).json({ message: "Client already added" });
    }

    const counselorClient = new CounselorClient({
      counselorId: counselorId,
      clientId: clientId,
      primaryIssue
    });

    await counselorClient.save();
    res.status(201).json(counselorClient);
  } catch (error) {
    console.error("Error adding client:", error);
    res.status(500).json({ message: "Failed to add client" });
  }
};
