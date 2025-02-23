import { Router } from "express";
import {
  loginUserController,
  registerUserController,
  signOutUserController,
  verifyUserController,
} from "../controllers/auth.controller";
import { AuthMiddleware } from "../middlewares";

const authRoutes = Router();

authRoutes.post("/signup", registerUserController);
authRoutes.post("/signin", loginUserController);
authRoutes.get("/verify-user", AuthMiddleware, verifyUserController);
authRoutes.get("/signout", signOutUserController);

export default authRoutes;
