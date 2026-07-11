import type { Request } from "express";

export type JwtPayload = {
  userId: string;
};

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
