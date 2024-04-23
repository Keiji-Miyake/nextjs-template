import { Member, Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "@/libs/prisma";

class MemberRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * 会員をIDで検索
   * @param id
   * @returns Promise<Member | null>
   * @throws Error
   */
  async get(params: { id?: string; email?: string }): Promise<Member | null> {
    const { id, email } = params;
    return await this.prisma.member.findUnique({
      where: {
        id: id !== undefined ? id : undefined,
        email: email !== undefined ? email : undefined,
      },
    });
  }

  /**
   * 会員をメールアドレスで検索
   * @param email
   * @returns Promise<Member | null>
   * @throws Error
   */
  async findByEmail(email: string): Promise<Member | null> {
    try {
      return await this.prisma.member.findUnique({
        where: { email, deletedAt: null },
      });
    } catch (error) {
      throw error;
    }
  }

  async create(params: Prisma.MemberCreateInput): Promise<Member> {
    return await this.prisma.member.create({
      data: params,
    });
  }

  async readAll(): Promise<Member[]> {
    try {
      return await this.prisma.member.findMany();
    } catch (error) {
      throw error;
    }
  }

  async update(member: Member): Promise<Member> {
    try {
      return await this.prisma.member.update({
        where: { id: member.id },
        data: member,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default MemberRepository;
