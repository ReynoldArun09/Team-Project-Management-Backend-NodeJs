import { z } from "zod";
import { loginSchema, registerSchema } from "../auth.schema";

export type registerSchemaType = z.infer<typeof registerSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
