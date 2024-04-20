import { Prisma, SignUpVerification } from "@prisma/client";
import { randomBytes } from "crypto";
import dayjs from "dayjs";

import { default as SignUpRepository } from "./repository";

class SignUpService {
  private signUpRepository: SignUpRepository;
  public token: string;
  public expiresAt: Date;

  constructor() {
    this.signUpRepository = new SignUpRepository();
    this.token = SignUpService.generate();
    this.expiresAt = SignUpService.expiresAt();
  }

  /**
   * トークンの生成
   * 32バイトのランダムなバイト列を生成し、それを16進数の文字列に変換して返します。
   * @returns
   */
  static generate(): string {
    return randomBytes(32).toString("hex");
  }

  /**
   * 有効期限の設定
   * 24時間後の日付を返します。
   * @returns
   */
  static expiresAt(): Date {
    return dayjs().add(1, "hour").toDate();
  }

  /**
   * 有効期限のテキストフォーマット
   * @param expiresAt
   * @returns
   */
  static expiresAtText(expiresAt = this.expiresAt()): string {
    return dayjs(expiresAt).format("YYYY年MM月DD日 HH:mm:ss");
  }

  /**
   * SignUpTokenを保存
   * @param email
   * @returns
   */
  async save(
    params: Prisma.SignUpVerificationUpsertArgs,
  ): Promise<SignUpVerification> {
    return await this.signUpRepository.upsert(params);
  }

  /**
   * SignUpToken情報を取得する
   * @param token
   * @returns Promise<SignUpVerification> | null
   * @throws Error
   */
  async get(token: string): Promise<SignUpVerification | null> {
    const tokenInfo = await this.signUpRepository.find(token);
    if (!tokenInfo || tokenInfo.expiresAt < new Date()) {
      return null;
    }
    return tokenInfo;
  }
}

export default SignUpService;
