import {
  Member,
  Prisma,
  PrismaClient,
  Role,
  SignUpToken,
  User,
} from "@prisma/client";
import bcrypt from "bcrypt";

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
  async findSignUpToken(token: string): Promise<SignUpToken | null> {
    try {
      return await this.prisma.signUpToken.findUnique({
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
