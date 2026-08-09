import type { LoginSchema, RegisterSchema } from "./auth.schema.js";
import { UserService } from "../users/user.service.js";
import { UnauthorizedError } from "@/errors/unauthorize-error.js";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";

export class AuthService {
  private userService = new UserService();

  async register(data: RegisterSchema) {
    return this.userService.createUser(data.email, data.password);
  }

  async login(data: LoginSchema) {
    const user = await this.userService.getUserByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN ?? "1d") as NonNullable<
      SignOptions["expiresIn"]
    >;

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn,
    });

    return { token };
  }

  async getProfile(userId: string) {
    return this.userService.getUserById(userId);
  }
}
