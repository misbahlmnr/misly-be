import { UserRepository } from "./user.repository.js";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository = new UserRepository();

  async createUser(email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.create(email, hashedPassword);
  }

  async getUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
