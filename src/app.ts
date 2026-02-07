import express, { Application } from "express";
import dotenv from "dotenv";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { generalRateLimit, burstProtectionRateLimit } from "./middleware/rateLimiter";
import routes from "./routes";

// Load environment variables
dotenv.config();

const app: Application = express();

// Apply burst protection first (most restrictive)
app.use(burstProtectionRateLimit);

// Apply general rate limiting
app.use(generalRateLimit);

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging and correlation ID
app.use(requestLogger);

// API routes
app.use('/api/v1', routes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
