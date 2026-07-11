import { AppError } from "@/errors/app-error.js";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(new AppError(`Cannot ${req.method} ${req.path}`, 404, "NOT_FOUND"));
};

export const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.code,
      },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.issues[0]?.message ?? "Validation failed",
      error: {
        code: "VALIDATION_ERROR",
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: {
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};
