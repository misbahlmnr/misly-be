import type { AuthRequest, JwtPayload } from "@/modules/auth/auth.types.js";
import { UnauthorizedError } from "@/errors/unauthorize-error.js";
import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = decoded;

    next();
  } catch {
    next(new UnauthorizedError("Unauthorized"));
  }
};
