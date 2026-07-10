import express, { Router } from "express";
import userRoutes from "./modules/users/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

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
    },
  });
});

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

app.use("/api", api);

export default app;
