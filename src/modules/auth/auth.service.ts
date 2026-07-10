import type { LoginSchema, RegisterSchema } from "./auth.schema.js";
import { UserService } from "../users/user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  private userService = new UserService();

  async register(data: RegisterSchema) {
    return this.userService.createUser(data.email, data.password);
  }

  async login(data: LoginSchema) {
    const user = await this.userService.getUserByEmail(data.email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // generate token & return it
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN!,
    });

    return { token };
  }
}
