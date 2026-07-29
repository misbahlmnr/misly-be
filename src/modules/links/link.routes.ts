import { LinkController } from "./link.controller.js";
import { LinkService } from "./link.service.js";
import { LinkRepository } from "./link.repository.js";
import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware.js";

const linkController = new LinkController(
  new LinkService(new LinkRepository()),
);
const router = Router();

router.get("/", authMiddleware, linkController.getLinks);
router.post("/", authMiddleware, linkController.createLink);

export default router;
