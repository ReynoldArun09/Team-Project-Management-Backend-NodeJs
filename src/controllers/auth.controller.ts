import type { Request, Response } from "express";
import { ParsedEnvVariables } from "../config/app.config";
import { AuthSuccessMessages } from "../constants";
import { loginUserService, registerUserService } from "../services/auth.services";
import { AsyncWrapper, SendApiResponse } from "../utils";
import { loginSchema, registerSchema } from "../validations/auth.schema";

/**
 * Controller function to handle user register requests.
 * this function validates request body using zod, invokes register user service to create new
 * user and return success message and status code of 201.
 *
 * @param req - The request object containing the user data for register.
 * @param res = The response object used to send the Api Response.
 * @returns A Success message with status code 201.
 */
export const registerUserController = AsyncWrapper(async (req: Request, res: Response) => {
  const body = registerSchema.parse(req.body);

  await registerUserService(body);

  SendApiResponse({
    res,
    statusCode: 201,
    message: AuthSuccessMessages.REGISTER_SUCCESS,
  });
});

/**
 * Controller function to handle user login requests.
 * this function validates request body using zod, invokes login user service to
 * find user and return success message, status code of 200, user data and http-cookie.
 *
 * @param req - The request object containing the user data for login.
 * @param res = The response object used to send the Api Response.
 * @returns A Success message with status code 200, user data and http-cookie.
 */
export const loginUserController = AsyncWrapper(async (req: Request, res: Response) => {
  const body = loginSchema.parse(req.body);
  const { user, token } = await loginUserService(body);

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: ParsedEnvVariables.NODE_ENV === "production",
    sameSite: ParsedEnvVariables.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  SendApiResponse({
    res,
    statusCode: 200,
    message: AuthSuccessMessages.LOGIN_SUCCESS,
    data: user,
  });
});

/**
 * Controller function to handle user verify.
 * this function handle user verification. it recevies user data from request object injected from auth middleware.
 *
 * @param req - The request object containing the user data for verification.
 * @param res = The response object used to send the Api Response.
 * @returns A Success message with status code 200 and user data attached through middleware.
 */
export const verifyUserController = AsyncWrapper(async (req: Request, res: Response) => {
  const user = req.ctx;

  SendApiResponse({
    res,
    statusCode: 200,
    data: user,
  });
});

/**
 * Controller function to handle user signout.
 * this function handle user signout it clear cookie and returns success Api response.
 *
 * @param res = The response object used to send the Api Response and to clear cookie.
 * @returns A Success message with status code 200.
 */
export const signOutUserController = AsyncWrapper(async (req: Request, res: Response) => {
  res.clearCookie("accessToken");

  SendApiResponse({
    res,
    statusCode: 200,
    message: AuthSuccessMessages.SIGN_OUT_SUCCESS,
  });
});
