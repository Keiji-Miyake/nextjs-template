import {
  Member,
  Prisma,
  PrismaClient,
  RegistrationToken,
  Role,
  User,
} from "@prisma/client";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

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
   * 会員登録Tokenを検索
   * @param token
   * @returns Promise<RegistrationToken | null>
   * @throws Error
   */
  async findRegistrationToken(
    token: string,
  ): Promise<RegistrationToken | null> {
    try {
      return await this.prisma.registrationToken.findUnique({
        where: { token },
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

  /**
   * 会員登録Tokenを作成
   * @param email
   * @returns Promise<RegistrationToken>
   * @throws Error
   */
  async createRegistrationToken(email: string): Promise<RegistrationToken> {
    try {
      // トークンを生成
      const token = randomBytes(32).toString("hex");
      console.debug("token:", token);
      // 有効期限の設定
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // 会員登録Tokenを保存
      const registrationToken = await this.prisma.registrationToken.upsert({
        where: { email },
        update: {
          token: token,
          expiresAt: expiresAt,
        },
        create: {
          email: email,
          token: token,
          expiresAt: expiresAt,
        },
      });
      console.log("registerTokenData:", registrationToken);
      return registrationToken;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 会員登録Tokenを削除
   * @param email
   */
  async deleteRegistrationToken(email: string): Promise<RegistrationToken> {
    try {
      // 会員登録Tokenを削除
      const deletedToken = await this.prisma.registrationToken.delete({
        where: { email },
      });
      console.log("deletedToken:", deletedToken);
      return deletedToken;
    } catch (error) {
      throw error;
    }
  }

  async create(
    createData: Prisma.MemberCreateInput,
    password: string,
  ): Promise<Member> {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      return await this.prisma.member.create({
        data: {
          id: createData.id,
          email: createData.email,
          name: createData.name,
          logo: createData.logo,
          users: {
            create: {
              name: createData.name,
              email: createData.email,
              password: hashedPassword,
              role: Role.ROOT,
              profileIcon: createData.logo,
            },
          },
        },
      });
    } catch (error: any) {
      throw error;
    }
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
