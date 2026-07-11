import type { AuthRequest, JwtPayload } from "@/modules/auth/auth.types.js";
import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
