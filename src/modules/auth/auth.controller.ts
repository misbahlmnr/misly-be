import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

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
}
