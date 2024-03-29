import { Member, Prisma, RegistrationToken } from "@prisma/client";
import bcrypt from "bcrypt";

import { NotFoundError } from "@/domains/error/class/NotFoundError";
import dayjs from "@/libs/dayjs";
import { deleteImageFromS3, uploadImageToS3 } from "@/libs/s3";
import { sendEmail } from "@/libs/sendmail";
import { generateSecureRandomString } from "@/libs/utils";

import MemberRepository from "./repository";
import {
  MEMBER_ID_LENGTH,
  MemberRegisterPostSchema,
  TMemberRegisterPostSchema,
} from "./schema";
import { BadRequestError } from "../error/class/BadRequestError";
import { ConflictError } from "../error/class/ConflictError";
import { UnauthorizedError } from "../error/class/UnauthorizedError";

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
   * 会員登録メールを送信
   * @param email
   * @returns Promise<any>
   */
  async sendRegistrationEmail(email: string): Promise<any> {
    try {
      // 会員登録Tokenを保存
      const registrationToken =
        await this.memberRepository.createRegistrationToken(email);

      const expireAtText = dayjs(registrationToken?.expiresAt).format(
        "YYYY年MM月DD日 HH:mm:ss",
      );
      // 会員登録メールを送信
      const text = `
新規登録ありがとうございます。
次のリンクをクリックして登録にお進みください。
${process.env.NEXT_PUBLIC_WEB_URL}/signup/confirm?token=${registrationToken?.token}
URLの有効期限は${expireAtText}です。
`;
      const html = `
<p>新規登録ありがとうございます。<br>次のリンクをクリックして登録にお進みください。</p>
<p><a href="${process.env.NEXT_PUBLIC_WEB_URL}/signup/confirm?token=${registrationToken?.token}">会員登録</a></p>
<p>URLの有効期限は${expireAtText}です。</p>
`;
      const result = await sendEmail({
        to: email,
        subject: "申し込みありがとうございます。",
        text: text,
        html: html,
      });
      console.log("新規登録メール送信しました:", result);
      return result;
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
   * 会員登録Tokenを取得
   * @param token
   * @returns Promise<RegistrationToken>
   */
  async getValidRegistrationToken(token: string): Promise<RegistrationToken> {
    try {
      const registrationToken =
        await this.memberRepository.findRegistrationToken(token);
      if (!registrationToken) {
        throw new NotFoundError("無効なトークンです。");
      }
      if (registrationToken.expiresAt < new Date()) {
        throw new UnauthorizedError("有効期限切れのトークンです。");
      }

      return registrationToken;
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
      if (validatedData.logo) {
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
