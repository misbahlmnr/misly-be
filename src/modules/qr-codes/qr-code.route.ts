import { authMiddleware } from "@/middleware/auth.middleware.js";
import { Router } from "express";
import { QrCodeController } from "./qr-code.controller.js";

const router = Router();
const qrCodeController = new QrCodeController();

router.get("/", authMiddleware, qrCodeController.getQrCodes);
router.post("/", authMiddleware, qrCodeController.createQrCode);
router.put("/:id", authMiddleware, qrCodeController.updateQrCode);
router.delete("/:id", authMiddleware, qrCodeController.deleteQrCode);

export default router;
