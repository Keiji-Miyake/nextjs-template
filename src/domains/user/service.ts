import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

import UserRepository from "@/domains/user/repository";
import { generateSecureRandomString } from "@/utils/generate-secure-random-string";

import {
  MEMBER_ID_LENGTH,
  SignUpUserSchema,
  type TRegisterUserSchema,
  type TSignUpUserSchema,
} from "./schema";

class UserService {
  private userRepository: UserRepository;

  constructor(prisma: PrismaClient) {
    this.userRepository = new UserRepository(prisma);
  }
  validateSignUpData(signUpData: TSignUpUserSchema) {
    try {
      const validatedData = SignUpUserSchema.parse(signUpData);
      // validatedDataから、confirmPasswordを除外する
      delete validatedData.confirmPassword;
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

  async registerUser(
    registerData: TRegisterUserSchema,
  ): Promise<User | unknown> {
    try {
      registerData.memberId = await this.generateMemberId();
      registerData.password = await bcrypt.hash(registerData.password, 10);
      const newUser = await this.userRepository.create(registerData);

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
