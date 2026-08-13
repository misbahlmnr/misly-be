import { Router } from "express";
import { AnalyticController } from "./analytic.controller.js";
import { authMiddleware } from "@/middleware/auth.middleware.js";

const analyticController = new AnalyticController();
const router = Router();

router.post("/:linkId", authMiddleware, analyticController.create);
router.get(
  "/:linkId/total-visits",
  authMiddleware,
  analyticController.getTotalVisits,
);
router.get("/:linkId/stats", authMiddleware, analyticController.getStats);

export default router;
