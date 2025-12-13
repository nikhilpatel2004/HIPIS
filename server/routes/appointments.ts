import { Request, RequestHandler } from "express";
import { z } from "zod";
import { Appointment } from "../models/Appointment";

type AuthedRequest = Request & { userId?: string; userRole?: string };

const AppointmentModel = Appointment as any;

const appointmentSchema = z.object({
  userId: z.string().min(1),
  counsellor: z.string().min(1),
  type: z.enum(["individual", "group", "crisis", "video-call", "in-person", "phone"]),
  date: z.string().or(z.date()),
  time: z.string().min(1),
  status: z.enum(["upcoming", "completed", "cancelled"]).optional(),
});

// Get all appointments for a user
export const getUserAppointments: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const requester = req as AuthedRequest;

    if (requester.userRole !== "admin" && requester.userId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const appointments = await AppointmentModel.find({ userId }).sort({ date: 1, time: 1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
};

// Create new appointment
export const createAppointment: RequestHandler = async (req, res) => {
  try {
    const parsed = appointmentSchema.safeParse({ ...req.body, userId: (req as AuthedRequest).userId || req.body.userId });
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Invalid appointment payload" });
    }

    const data = parsed.data;
    const appointment = new AppointmentModel({
      ...data,
      userId: data.userId,
      date: new Date(data.date),
    });
    await appointment.save();
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ success: false, message: "Failed to create appointment" });
  }
};

// Cancel appointment
export const cancelAppointment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req as AuthedRequest;
    const appointment = await AppointmentModel.findById(id);
    
    if (!appointment) {
      res.status(404).json({ success: false, message: "Appointment not found" });
      return;
    }

    const isOwner = requester.userId && appointment.userId?.toString() === requester.userId;
    const isCounselor = requester.userId && appointment.counsellor?.toString() === requester.userId;
    const isAdmin = requester.userRole === "admin";

    if (!isOwner && !isCounselor && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    appointment.status = "cancelled";
    await appointment.save();
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Failed to cancel appointment" });
  }
};
