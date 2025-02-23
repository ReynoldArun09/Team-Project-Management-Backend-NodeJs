import { type Response } from "express";
import { HttpStatusCode } from "../constants";

interface ApiResponse<T> {
  res: Response;
  statusCode: HttpStatusCode;
  success?: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export const SendApiResponse = <T>({ res, statusCode, success = true, message, data, ...rest }: ApiResponse<T>) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    ...rest,
  });
};
