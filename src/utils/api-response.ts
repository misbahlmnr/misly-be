import type { Response } from "express";

type MetaPagination = {
  page: number;
  limit: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type SendSuccessOptions<T> = {
  res: Response;
  data: T;
  meta?: MetaPagination;
  message: string;
  statusCode?: number;
};

export function sendSuccess<T>({
  res,
  data,
  meta,
  message,
  statusCode = 200,
}: SendSuccessOptions<T>) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
}
