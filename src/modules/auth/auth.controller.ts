import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import type { AuthRequest } from "./auth.types.js";
import { UnauthorizedError } from "@/errors/unauthorize-error.js";
import { sendSuccess } from "@/utils/api-response.js";

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.authService.register({ email, password });

    return sendSuccess({
      res,
      data: user,
      message: "User created successfully",
      statusCode: 201,
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const token = await this.authService.login({ email, password });

    return sendSuccess({
      res,
      data: token,
      message: "Login successful",
    });
  };

  getProfile = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const user = await this.authService.getProfile(userId);

    return sendSuccess({
      res,
      data: user,
      message: "Profile fetched successfully",
    });
  };
}
