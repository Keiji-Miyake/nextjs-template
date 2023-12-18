import { PrismaClient, Role, User as UserModel } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { TUserCreateSchema } from "./schema";

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

  async findByEmail(email: string): Promise<UserModel | null> {
    try {
      const user = await this.prisma.user.findFirst({ where: { email } });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async save(user: UserModel): Promise<UserModel> {
    try {
      return await this.prisma.user.create({ data: user });
    } catch (error) {
      throw error;
    }
  }

  async create(signUpData: TUserCreateSchema): Promise<UserModel | unknown> {
    try {
      return await this.prisma.user.create({ data: signUpData });
    } catch (error: any) {
      throw error;
    }
  }
}

export default UserRepository;
