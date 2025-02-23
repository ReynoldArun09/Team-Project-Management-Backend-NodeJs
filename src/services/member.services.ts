import { HttpStatusCode, MemberErrorMessages } from "../constants";
import { AuthErrorMessages } from "../constants/auth/authError.messages";
import { prisma } from "../lib/prismaClient";
import { AppError } from "../utils";

export const joinMemberWorkspaceService = async (userId: string, inviteCode: string) => {
  const existingWorkspace = await prisma.workspace.findFirst({
    where: {
      inviteCode,
    },
  });

  if (!existingWorkspace) {
    throw new AppError(MemberErrorMessages.WORKSPACE_OR_INVITE_CODE_NOT_FOUND, HttpStatusCode.BAD_REQUEST);
  }

  const existingMember = await prisma.member.findFirst({
    where: {
      userId,
      workSpaceId: existingWorkspace.id,
    },
  });

  if (existingMember) {
    throw new AppError(MemberErrorMessages.ALREADY_WORKSPACE_MEMBER, HttpStatusCode.BAD_REQUEST);
  }

  const existingRole = await prisma.role.findUnique({
    where: {
      name: "MEMBER",
    },
  });

  if (!existingRole) {
    throw new AppError(AuthErrorMessages.ROLE_NOT_FOUND, HttpStatusCode.BAD_REQUEST);
  }

  await prisma.member.create({
    data: {
      userId,
      workSpaceId: existingWorkspace.id,
      roleId: existingRole.id,
    },
  });

  return { workSpaceId: existingWorkspace, role: existingRole.name };
};

export const getMemberRoleInWorkspace = async (userId: string, workSpaceId: string) => {
  const existingWorkspace = await prisma.workspace.findUnique({
    where: {
      id: workSpaceId,
    },
  });

  if (!existingWorkspace) {
    throw new AppError(MemberErrorMessages.WORKSPACE_OR_INVITE_CODE_NOT_FOUND, HttpStatusCode.BAD_REQUEST);
  }

  const existingMember = await prisma.member.findFirst({
    where: {
      userId,
      workSpaceId,
    },
    include: {
      Role: true,
    },
  });

  if (!existingMember) {
    throw new AppError(MemberErrorMessages.NOT_MEMBER, HttpStatusCode.BAD_REQUEST);
  }

  const roleName = existingMember.Role.name;

  return { role: roleName };
};
