import { Router } from "express";
import { DomainController } from "./domain.controller.js";
import { authMiddleware } from "@/middleware/auth.middleware.js";

const router = Router();
const domainController = new DomainController();

router.get("/", authMiddleware, domainController.getAllDomain);
router.post("/", authMiddleware, domainController.addDomain);
router.put("/:id", authMiddleware, domainController.updateDomain);
router.delete("/:id", authMiddleware, domainController.deleteDomain);
router.post("/:id/verify", authMiddleware, domainController.verifyDomain);

export default router;
