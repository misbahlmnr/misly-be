import { UserRepository } from "./user.repository.js";

export class UserService {
  private userRepository = new UserRepository();

  async createUser(email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    return this.userRepository.create(email, password);
  }

  async getUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }
}
