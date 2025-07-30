
import { clerkClient } from "@clerk/nextjs/server";
import type { Express, RequestHandler } from "express";

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await clerkClient.sessions.getSession(sessionId);
    
    if (!session || session.status !== 'active') {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(session.userId);
    req.user = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profileImageUrl: user.imageUrl || ''
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export async function setupAuth(app: Express) {
  // Auth user endpoint
  app.get("/api/auth/user", isAuthenticated, (req, res) => {
    res.json(req.user);
  });
}
