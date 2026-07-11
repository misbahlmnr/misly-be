import { ConflictError } from "@/errors/conflict-error.js";
import { NotFoundError } from "@/errors/not-found-error.js";
import { UserRepository } from "./user.repository.js";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository = new UserRepository();

  async createUser(email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.create(email, hashedPassword);
  }

  async getUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
