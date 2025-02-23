import jwt from "jsonwebtoken";
import { ParsedEnvVariables } from "../config/app.config";
import { HttpStatusCode } from "../constants";
import { AuthErrorMessages } from "../constants/auth/authError.messages";
import { compareHashValue, generateHashValue } from "../helpers/bcrypt";
import { generateCode } from "../helpers/generateCode";
import { prisma } from "../lib/prismaClient";
import { AppError } from "../utils";
import { loginSchemaType, registerSchemaType } from "../validations/@types";

export const registerUserService = async (body: registerSchemaType) => {
  const { name, email, password } = body;

  const transactionResult = await prisma?.$transaction(async (prisma) => {
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new AppError(AuthErrorMessages.USER_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
    }

    const hashPassword = await generateHashValue(password, 10);

    user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        name,
      },
    });

    const workSpace = await prisma.workspace.create({
      data: {
        name: "My Workspace",
        description: `Workspace created for ${user.name}`,
        inviteCode: generateCode(),
      },
    });

    const existingRole = await prisma.role.findUnique({
      where: {
        name: "OWNER",
      },
    });
    if (!existingRole) {
      throw new AppError(AuthErrorMessages.ROLE_NOT_FOUND, HttpStatusCode.BAD_REQUEST);
    }

    await prisma.member.create({
      data: {
        userId: user.id,
        workSpaceId: workSpace.id,
        roleId: existingRole.id,
        joinedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        workSpaceId: workSpace.id,
      },
    });

    return user;
  });

  return { user: transactionResult };
};
export const loginUserService = async (body: loginSchemaType) => {
  const { email, password } = body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    throw new AppError(AuthErrorMessages.USER_NOT_FOUND, HttpStatusCode.BAD_REQUEST);
  }

  const comparePassword = await compareHashValue(password, existingUser.password);

  if (!comparePassword) {
    throw new AppError(AuthErrorMessages.INVALID_CREDENTIALS, HttpStatusCode.BAD_REQUEST);
  }

  const token = await jwt.sign({ id: existingUser.id }, ParsedEnvVariables.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  const formatData = {
    id: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    workSpaceId: existingUser.workSpaceId,
  };

  return { user: formatData, token };
};
