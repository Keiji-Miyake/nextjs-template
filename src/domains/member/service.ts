import { Member, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

import { MEMBER_ID_LENGTH } from "@/config/site";
import { BadRequestError } from "@/domains/error/class/BadRequestError";
import { ConflictError } from "@/domains/error/class/ConflictError";
import { NotFoundError } from "@/domains/error/class/NotFoundError";
import MemberRepository from "@/domains/member/repository";
import {
  MemberRegisterPostSchema,
  TMemberRegisterPostSchema,
} from "@/domains/member/schema";
import { deleteImageFromS3, uploadImageToS3 } from "@/libs/s3";
import { generateSecureRandomString } from "@/libs/utils";

class MemberService {
  private memberRepository: MemberRepository;

  constructor() {
    this.memberRepository = new MemberRepository();
  }

  /**
   * 会員登録済みかどうか
   * @param email
   * @returns Promise<boolean>
   */
  async isExisting(email: string): Promise<boolean> {
    try {
      const existingMember = await this.memberRepository.findByEmail(email);
      return existingMember ? true : false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * ルートユーザーが既に存在するかどうか
   * @param memberId
   * @param email
   * @returns Promise<boolean>
   */
  async isExistingRootUser(memberId: string, email: string): Promise<boolean> {
    try {
      const existingUser = await this.memberRepository.findRootUser(
        email,
        memberId,
      );
      return existingUser ? true : false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 会員番号を生成
   * @returns Promise<string>
   */
  async generateMemberId(): Promise<string> {
    try {
      const memberId = await generateSecureRandomString(MEMBER_ID_LENGTH);
      // 既に存在する会員番号でないか
      const existingMember = await this.memberRepository.findById(memberId);
      if (existingMember) {
        return this.generateMemberId();
      }
      return memberId;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 会員登録
   * @param params
   * @returns Promise<Member>
   * @throws Error
   */
  async register(params: TMemberRegisterPostSchema): Promise<Member> {
    const memberId = await this.generateMemberId();
    const logoUploadPath = `${memberId}/logo`;
    let logoAbsolutePath: string | undefined;
    try {
      const validatedData = MemberRegisterPostSchema.parse(params);

      // メールアドレスが既に登録済みでないか
      if (await this.isExisting(validatedData.email)) {
        console.error("登録済みのメールアドレス:", validatedData.email);
        throw new ConflictError(
          "既に登録済みです。ログインしてご利用いただけます。",
        );
      }

      const createData: Prisma.MemberCreateInput = {
        ...validatedData,
        id: memberId,
        logo: "",
      };

      // logoがあれば、画像をアップロードして、そのURLを返す。データベースにはファイル名を保存する。
      if (validatedData.logo instanceof File) {
        createData.logo = await uploadImageToS3(
          validatedData.logo,
          logoUploadPath,
        );
        logoAbsolutePath = createData.logo;
      }

      const newMember: Member = await this.memberRepository.create(
        createData,
        validatedData.password,
      );

      // RegistrationTokenを削除
      await this.memberRepository.deleteRegistrationToken(createData.email);

      return newMember;
    } catch (error) {
      if (logoAbsolutePath) {
        // アップロードした画像を削除
        await deleteImageFromS3(logoAbsolutePath);
      }
      throw error;
    }
  }

  /**
   * サインイン
   * @param credentials
   * @returns Promise<Member>
   * @throws Error
   */
  async signIn(credentials: Record<"email" | "password", string>) {
    console.debug("credentials:", credentials);
    try {
      // 1. ルートユーザーが存在するか
      const rootUser = await this.memberRepository.findRootUser(
        credentials.email,
      );
      // 3. もし存在しなかったら
      if (!rootUser) {
        throw new NotFoundError("登録されていません。");
      }

      // 4. パスワードが正しいか
      const isValidPassword = await bcrypt.compare(
        credentials.password,
        rootUser.password,
      );

      // 5. パスワードが正しくなかったら
      if (!isValidPassword) {
        throw new BadRequestError("パスワードが正しくありません。");
      }

      // 6. ログイン
      return rootUser;
    } catch (error) {
      throw error;
    }
  }
}

export default MemberService;
