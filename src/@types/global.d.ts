import { PrismaClient } from "@prisma/client";

export type UserJwtPayload = {
  id: string;
  name: string;
  email: string;
  workSpaceId: string | null;
};

declare global {
  var prisma: PrismaClient | undefined;
  namespace Express {
    interface Request {
      ctx: UserJwtPayload;
    }
  }
}
