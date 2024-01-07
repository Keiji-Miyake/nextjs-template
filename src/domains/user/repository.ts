import { Prisma, PrismaClient, Role, User as UserModel } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import "server-only";

class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findByRootUser(memberId: string): Promise<UserModel | null> {
    try {
      const rootUser = await this.prisma.user.findFirst({
        where: { role: Role.ROOT, memberId },
      });
      return rootUser;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<UserModel | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * メンバー内のユニークユーザーを取得
   */
  async findByMemberId(memberId: string): Promise<UserModel[] | null> {
    try {
      // rootユーザーで、memberIdを持つユーザーを検索する
      const memberUsers = await this.prisma.user.findMany({
        where: { memberId },
      });
      return memberUsers;
    } catch (error) {
      throw error;
    }
  }

  async findUnique(email: string, memberId: string): Promise<UserModel | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          UniqueMemberUser: {
            email: email,
            memberId: memberId,
          },
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * メンバー内のユーザーをページネーションで取得する
   * @param memberId
   * @param page
   * @param perPage
   * @returns
   */
  async findByMemberIdWithPagination(
    memberId: string,
    page: number,
    perPage: number,
  ): Promise<UserModel[] | null> {
    const skip = page > 0 ? (page - 1) * perPage : 0;
    try {
      const users = await this.prisma.user.findMany({
        where: { memberId },
        skip: skip,
        take: perPage,
      });
      return users;
    } catch (error) {
      throw error;
    }
  }

  async create(user: Prisma.UserCreateInput): Promise<UserModel> {
    try {
      return await this.prisma.user.create({ data: user });
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
