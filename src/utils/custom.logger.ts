import { createLogger, format, transports } from "winston";

const formatStyle = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

export const logger = createLogger({
  level: "info",
  format: formatStyle,
  transports: [new transports.Console(), new transports.File({ filename: "error.log", level: "error" })],
});
