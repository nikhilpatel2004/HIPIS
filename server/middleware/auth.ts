import { RequestHandler } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
      return;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ 
        success: false, 
        message: "Invalid or expired token" 
      });
      return;
    }

    // Attach user info to request
    (req as any).userId = decoded.userId;
    (req as any).userEmail = decoded.email;
    (req as any).userRole = decoded.role;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ 
      success: false, 
      message: "Authentication failed" 
    });
  }
};
