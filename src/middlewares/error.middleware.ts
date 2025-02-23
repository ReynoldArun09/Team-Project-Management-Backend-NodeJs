import { ErrorRequestHandler } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";
import { GlobalErrorMessages, HttpStatusCode } from "../constants";
import { AppError, logger } from "../utils";

export const formatZodError = (error: ZodError) => {
  const errors = error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return errors;
};

export const ErrorHandler: ErrorRequestHandler = (error, req, res, next): any => {
  if (error instanceof SyntaxError) {
    return res.status(HttpStatusCode.FORBIDDEN).json({
      message: error.message || GlobalErrorMessages.INVALID_JSON_FORMAT,
    });
  }

  if (error instanceof ZodError) {
    const errors = formatZodError(error);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Validation Failed",
      errors: errors,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof TokenExpiredError) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: error.message || GlobalErrorMessages.JWT_EXPIRED,
    });
  }

  if (error instanceof JsonWebTokenError) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: error.message || GlobalErrorMessages.JWT_INVALID,
    });
  }

  logger.error(error);

  return res.status(HttpStatusCode.INTERNAL_SERVER).json({
    message: GlobalErrorMessages.INTERNAL_SERVER_ERROR,
  });
};
