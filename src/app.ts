import express from "express";
import userRoutes from "./modules/users/user.routes.js";

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.json({ message: "API running" });
});

app.get("/health", (_, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/users", userRoutes);

export default app;
