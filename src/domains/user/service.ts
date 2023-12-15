import { User } from "@prisma/client";

import UserRepository from "@/domains/user/repository";
import { passwordHash } from "@/utils/password-hash";

import { TUserCreateSchema } from "./schema";

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async isExistingUser(email: string): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      return existingUser ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async create(createData: TUserCreateSchema): Promise<User | unknown> {
    const hashedPassword = await passwordHash(createData?.password);
    createData.password = hashedPassword;

    try {
      const newUser = await this.userRepository.create(createData);
      return newUser;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
