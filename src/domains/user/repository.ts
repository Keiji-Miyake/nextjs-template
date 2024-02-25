import { Prisma, PrismaClient, Role, User as UserModel } from "@prisma/client";

import { prisma } from "@/libs/prisma";

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
   * member内のユーザーをページネーションで取得。
   * @param memberId
   * @param page
   * @param perPage
   * @returns users User[] | null
   * @throws PrismaClientKnownRequestError
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

  /**
   * メンバー内のユニークユーザー数を取得
   * @param memberId
   * @returns count
   * @throws PrismaClientKnownRequestError
   */
  async countByMemberId(memberId: string): Promise<number> {
    try {
      const count = await this.prisma.user.count({ where: { memberId } });
      return count;
    } catch (error) {
      throw error;
    }
  }

  /**
   * ユーザー作成
   * @param user
   * @returns
   */
  async create(user: Prisma.UserCreateInput): Promise<UserModel> {
    try {
      return await this.prisma.user.create({ data: user });
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
