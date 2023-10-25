import { Member as MemberModel, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import { TSignUpMemberSchema } from "./schema";

class MemberRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<MemberModel | null> {
    try {
      const member = await this.prisma.member.findUnique({ where: { id } });
      return member;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<MemberModel | null> {
    try {
      const member = await this.prisma.member.findUnique({ where: { email } });
      return member;
    } catch (error) {
      throw error;
    }
  }

  async save(member: MemberModel): Promise<MemberModel> {
    try {
      return await this.prisma.member.create({ data: member });
    } catch (error) {
      throw error;
    }
  }

  async create(
    signUpData: TSignUpMemberSchema,
  ): Promise<MemberModel | unknown> {
    try {
      signUpData.password = await bcrypt.hash(signUpData.password, 10);
      return await this.prisma.member.create({ data: signUpData });
    } catch (error: any) {
      throw error;
    }
  }
}

export default MemberRepository;
