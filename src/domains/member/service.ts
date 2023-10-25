import { Member, PrismaClient } from "@prisma/client";

import MemberRepository from "./repository";
import {
  SignUpMemberSchema,
  TRegisterMemberSchema,
  TSignUpMemberSchema,
} from "./schema";

class MemberService {
  private memberRepository: MemberRepository;

  constructor(prisma: PrismaClient) {
    this.memberRepository = new MemberRepository(prisma);
  }

  validateSignUpData(signUpData: TSignUpMemberSchema) {
    try {
      const validatedData = SignUpMemberSchema.parse(signUpData);
      // validatedDataから、confirmPasswordを除外する
      delete validatedData.confirmPassword;
      return validatedData;
    } catch (error) {
      throw error;
    }
  }

  async isExistingMember(email: string): Promise<boolean> {
    try {
      const existingMember = await this.memberRepository.findByEmail(email);
      return existingMember ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async registerMember(
    registerData: TRegisterMemberSchema,
  ): Promise<Member | unknown> {
    try {
      const newMember = await this.memberRepository.create(registerData);

      return newMember;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default MemberService;
