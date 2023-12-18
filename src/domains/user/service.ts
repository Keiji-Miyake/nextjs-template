import { User } from "@prisma/client";
import bcrypt from "bcrypt";

import UserRepository from "@/domains/user/repository";

import { TUserCreateSchema } from "./schema";

import "server-only";

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
    const hashedPassword = await bcrypt.hash(createData?.password, 10);
    createData.password = hashedPassword;

    try {
      const newUser = await this.userRepository.create(createData);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async getMemberUsers(memberId: string): Promise<User[] | null> {
    if (!memberId) return null;
    try {
      const users = await this.userRepository.findByMemberId(memberId);
      return users;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
