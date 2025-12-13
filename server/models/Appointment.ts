import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true 
  },
  counsellor: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ["individual", "group", "crisis", "video-call", "in-person", "phone"]
  },
  date: { 
    type: Date,
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    default: "upcoming",
    enum: ["upcoming", "completed", "cancelled"]
  }
}, { 
  timestamps: true 
});

export const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
