import { PrismaClient, Role, User } from "@prisma/client";
import bcrypt from "bcrypt";

import UserRepository from "@/domains/user/repository";
import { generateSecureRandomString } from "@/utils/generate-secure-random-string";

import {
  MEMBER_ID_LENGTH,
  TUserCreateSchema,
  TUserSignUpSchema,
  UserSignUpSchema,
} from "./schema";

class UserService {
  private userRepository: UserRepository;

  constructor(prisma: PrismaClient) {
    this.userRepository = new UserRepository(prisma);
  }
  validateSignUpData(signUpData: TUserSignUpSchema) {
    try {
      const validatedData = UserSignUpSchema.parse(signUpData);
      return validatedData;
    } catch (error) {
      throw error;
    }
  }

  async isExistingUser(email: string): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      return existingUser ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async signUpUser(signUpData: TUserSignUpSchema): Promise<User | unknown> {
    try {
      const memberId = await this.generateMemberId();
      const hashedPassword = await bcrypt.hash(signUpData.password, 10);
      const role = Role.ROOT;
      const createData: TUserCreateSchema = {
        ...signUpData,
        password: hashedPassword,
        memberId,
        role,
      };
      const newUser = await this.userRepository.create(createData);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async generateMemberId(): Promise<string> {
    try {
      const memberId = await generateSecureRandomString(MEMBER_ID_LENGTH);
      return memberId;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
