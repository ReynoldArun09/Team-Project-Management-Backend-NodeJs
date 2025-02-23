import { type Response } from "express";
import { HttpStatusCode } from "../constants";

interface ApiResponse<T> {
  res: Response;
  statusCode: HttpStatusCode;
  success?: boolean;
  message?: string;
  data?: T;
}

export const SendApiResponse = <T>({ res, statusCode, success = true, message, data }: ApiResponse<T>) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};
