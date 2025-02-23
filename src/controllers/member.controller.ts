import { Request, Response } from "express";
import { z } from "zod";
import { HttpStatusCode, MemberSuccessMessages } from "../constants";
import { joinMemberWorkspaceService } from "../services/member.services";
import { AsyncWrapper, SendApiResponse } from "../utils";

export const joinMemberWorkspaceController = AsyncWrapper(async (req: Request, res: Response) => {
  const inviteCode = z.string().parse(req.params.inviteCode);
  const userId = req.ctx.id;

  const { workSpaceId, role } = await joinMemberWorkspaceService(userId, inviteCode);

  SendApiResponse({
    res,
    statusCode: HttpStatusCode.OK,
    message: MemberSuccessMessages.JOINED_WORKSPACE,
    workSpaceId,
    role,
  });
});
