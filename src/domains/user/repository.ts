import { PrismaClient, Role, User as UserModel } from "@prisma/client";

import { TRegisterUserSchema } from "./schema";

class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<UserModel | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByMemberId(memberId: string): Promise<UserModel | null> {
    try {
      // rootユーザーで、memberIdを持つユーザーを検索する
      const user = await this.prisma.user.findFirst({
        where: { role: Role.ROOT, memberId },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
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

  async create(signUpData: TRegisterUserSchema): Promise<UserModel | unknown> {
    try {
      return await this.prisma.user.create({ data: signUpData });
    } catch (error: any) {
      throw error;
    }
  }
}

export default UserRepository;
