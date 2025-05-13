import express from "express";

const app = express();
app.use(express.json());
app.use(cookieParser());

// routes imports
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1", authRoutes);
export default app;
