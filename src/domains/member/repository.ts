import { Member, Prisma, PrismaClient, Role, User } from "@prisma/client";

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
  async findById(id: string): Promise<Member | null> {
    try {
      return await this.prisma.member.findUnique({ where: { id } });
    } catch (error) {
      throw error;
    }
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

  /**
   * ルートユーザーを検索
   * @param email
   * @param memberId
   * @returns Promise<User | null>
   * @throws Error
   */
  async findRootUser(email: string, memberId?: string): Promise<User | null> {
    try {
      const rootUser = await this.prisma.user.findFirst({
        where: {
          role: Role.ROOT,
          memberId,
          email,
        },
      });
      return rootUser;
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
