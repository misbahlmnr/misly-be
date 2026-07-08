import { Router } from "express";
import { UserController } from "./user.controller.js";

const userController = new UserController();
const router = Router();

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);

export default router;
