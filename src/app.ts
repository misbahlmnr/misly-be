import express, { Router } from "express";
import userRoutes from "./modules/users/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import linkRoutes from "./modules/links/link.routes.js";
import analyticRoutes from "./modules/analytics/analytic.routes.js";
import overviewRoutes from "./modules/overview/overview.route.js";
import {
  errorHandlerMiddleware,
  notFoundMiddleware,
} from "./middleware/error-handler.middleware.js";
import { LinkController } from "./modules/links/link.controller.js";

const linkController = new LinkController();

const app = express();
const api = Router();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Misly API running",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
      },
      users: {
        list: "GET /api/users",
        create: "POST /api/users",
        getById: "GET /api/users/:id",
      },
      links: {
        create: "POST /api/links/:userId",
      },
    },
  });
});

app.get("/:slug", linkController.redirectBySlug);

api.get("/health", (_, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

api.get("/", (_, res) => {
  res.json({
    message: "Misly API running",
  });
});

api.use("/auth", authRoutes);
api.use("/users", userRoutes);
api.use("/links", linkRoutes);
api.use("/analytics", analyticRoutes);
api.use("/dashboard/overview", overviewRoutes);

app.use("/api", api);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
