import type { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { sendSuccess } from "@/utils/api-response.js";

export class UserController {
  private userService = new UserService();

  createUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.userService.createUser(email, password);

    return sendSuccess({
      res,
      data: user,
      message: "User created successfully",
      statusCode: 201,
    });
  };

  getUsers = async (_req: Request, res: Response) => {
    const users = await this.userService.getUsers();

    return sendSuccess({
      res,
      data: users,
      message: "Users fetched successfully",
    });
  };

  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id as string);

    return sendSuccess({
      res,
      data: user,
      message: "User fetched successfully",
    });
  };
}
