import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import type { AuthRequest } from "./auth.types.js";
import { UnauthorizedError } from "@/errors/unauthorize-error.js";

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.authService.register({ email, password });

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const token = await this.authService.login({ email, password });

    res.status(200).json({
      message: "Login successful",
      data: token,
    });
  };

  getProfile = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const user = await this.authService.getProfile(userId);

    res.status(200).json({
      message: "Profile fetched successfully",
      data: user,
    });
  };
}
