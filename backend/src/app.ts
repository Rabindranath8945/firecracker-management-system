import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

// Security
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Middleware
app.use(compression());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🚀 Firecracker Management API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

export default app;
