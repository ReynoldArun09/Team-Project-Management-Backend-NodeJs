import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserJwtPayload } from "../@types/global";
import { ParsedEnvVariables } from "../config/app.config";
import { GlobalErrorMessages, HttpStatusCode } from "../constants";
import { AppError } from "../utils";

export const AuthMiddleware: RequestHandler = async (req, res, next): Promise<any> => {
  const accessToken = req.cookies.accessToken;

  try {
    if (!accessToken) {
      throw new AppError(GlobalErrorMessages.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED);
    }
    const decoded = jwt.verify(accessToken, ParsedEnvVariables.ACCESS_TOKEN_SECRET) as UserJwtPayload;

    const existingCustomer = await prisma?.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        workSpaceId: true,
      },
    });

    if (!existingCustomer) {
      throw new AppError(GlobalErrorMessages.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED);
    }

    req.ctx = existingCustomer;
    next();
  } catch (error) {
    next(error);
  }
};
