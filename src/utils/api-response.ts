import type { Response } from "express";

type SendSuccessOptions<T> = {
  res: Response;
  data: T;
  message: string;
  statusCode?: number;
};

export function sendSuccess<T>({
  res,
  data,
  message,
  statusCode = 200,
}: SendSuccessOptions<T>) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
