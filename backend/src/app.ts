import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";

import { notFoundHandler } from "./common/middleware/notFoundHandler.js";
import { errorHandler } from "./common/middleware/errorHandler.js";

import path from "path";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(compression());

app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Upload API
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Root API
app.get("/api", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 OneHub System API",
    version: "1.0.0",
  });
});

// Main Routes
app.use("/api", routes);

// 404
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
