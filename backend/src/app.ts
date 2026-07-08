import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { notFoundHandler } from "./common/middleware/notFoundHandler.js";
import { errorHandler } from "./common/middleware/errorHandler.js";

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

app.use("/api", routes, (_req, res) => {
  res.json({
    success: true,
    message: "🚀 Firecracker Management API",
    version: "1.0.0",
  });
});

// 404
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
