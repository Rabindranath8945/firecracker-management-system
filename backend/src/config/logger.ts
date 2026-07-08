import winston from "winston";

const { combine, timestamp, colorize, printf, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] ${stack || message}`;
});

export const logger = winston.createLogger({
  level: "info",

  format: combine(errors({ stack: true }), timestamp(), logFormat),

  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
  ],
});
