import { Router } from "express";
import { joinMemberWorkspaceController } from "../controllers/member.controller";
import { AuthMiddleware } from "../middlewares";

const memberRoutes = Router();

memberRoutes.post("/workspace/:inviteCode/join", AuthMiddleware, joinMemberWorkspaceController);

export default memberRoutes;
