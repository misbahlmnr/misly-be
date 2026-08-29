import { Router } from "express";
import { OverviewController } from "./overview.controller.js";
import { authMiddleware } from "@/middleware/auth.middleware.js";

const router = Router();
const overviewController = new OverviewController();

router.get("/", authMiddleware, overviewController.getOverview);

export default router;
