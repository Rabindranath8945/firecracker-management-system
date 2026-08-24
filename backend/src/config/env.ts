import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",

  PORT: Number(process.env.PORT || 5000),

  MONGODB_URI: process.env.MONGODB_URI ?? "",

  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:3000",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? "",

  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES ?? "15m",
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES ?? "30d",
} as const;
