import {
  Member,
  PrismaClient,
  RegistrationToken,
  Role,
  User,
} from "@prisma/client";
import { randomBytes } from "crypto";

import { prisma } from "@/lib/prisma";
import { passwordHash } from "@/utils/password-hash";

import { TMemberBaseSchema } from "./schema";

class MemberRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findById(id: string): Promise<Member | null> {
    try {
      return await this.prisma.member.findUnique({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Member | null> {
    try {
      return await this.prisma.member.findUnique({
        where: { email, deletedAt: null },
      });
    } catch (error) {
      throw error;
    }
  }

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

  async create(createData: TMemberBaseSchema): Promise<Member> {
    const hashedPassword = await passwordHash(createData.password);
    createData.password = hashedPassword;
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
              password: createData.password,
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
