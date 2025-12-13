import { Request, RequestHandler } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { generateToken } from "../utils/jwt";

type AuthedRequest = Request & { userId?: string };

const UserModel = User as any;

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["student", "counsellor", "admin"]).optional(),
  university: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Register new user
export const signup: RequestHandler = async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Invalid signup payload" });
      return;
    }

    const { name, email, password, role, university } = parsed.data;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ 
        success: false, 
        message: "Email already registered" 
      });
      return;
    }

    // Create new user
    const user = new UserModel({
      name,
      email,
      password,
      role: role || "student",
      university: university || "",
    });

    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to register user" 
    });
  }
};

// Login user
export const login: RequestHandler = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Invalid login payload" });
      return;
    }

    const { email, password } = parsed.data;

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({ 
        success: false, 
        message: "Account is deactivated. Contact admin." 
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to login" 
    });
  }
};

// Get current user profile
export const getProfile: RequestHandler = async (req, res) => {
  try {
    const authedReq = req as AuthedRequest;
    const userId = authedReq.userId; // Set by auth middleware
    
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
      return;
    }

    res.json({
      success: true,
      data: user.toJSON()
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch profile" 
    });
  }
};
