import type { Request, Response } from "express";
import { UserService } from "./user.service.js";

export class UserController {
  private userService = new UserService();

  createUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.userService.createUser(email, password);

    res.status(201).json(user);
  };

  getUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getUsers();
    res.status(200).json(users);
  };

  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id as string);
    res.status(200).json(user);
  };
}
