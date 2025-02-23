import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import { ParsedEnvVariables } from "./config/app.config";
import { ErrorHandler, RouteNotFound } from "./middlewares";
import { authRoutes } from "./routes";

const app: Application = express();
app.use(
  cors({
    origin: ParsedEnvVariables.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.disable("x-powered-by");

app.use("/api/auth", authRoutes);

app.use(RouteNotFound);
app.use(ErrorHandler);

export default app;
