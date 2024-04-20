import { Prisma, PrismaClient, SignUpVerification } from "@prisma/client";

import { prisma } from "@/libs/prisma";

class SignUpRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * 取得
   * @param token
   * @returns Promise<SignUpVerification> | null
   * @throws Error
   */
  async find(token: string): Promise<SignUpVerification | null> {
    return await this.prisma.signUpVerification.findUnique({
      where: { token },
    });
  }

  /**
   * 登録・更新
   * @param params
   * @returns Promise<RegistrationToken>
   * @throws Error
   */
  async upsert(
    params: Prisma.SignUpVerificationUpsertArgs,
  ): Promise<SignUpVerification> {
    return await this.prisma.signUpVerification.upsert(params);
  }

  /**
   * 削除
   * @param email
   * @returns Promise<RegistrationToken>
   * @throws Error
   */
  async delete(email: string): Promise<SignUpVerification> {
    return await this.prisma.signUpVerification.delete({
      where: { email },
    });
  }
}

export default SignUpRepository;
