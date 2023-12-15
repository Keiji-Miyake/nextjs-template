import { Member, RegistrationToken } from "@prisma/client";
import bcrypt from "bcrypt";

import { AppError } from "@/domains/error/class/AppError";
import UserService from "@/domains/user/service";
import dayjs from "@/lib/dayjs";
import { generateSecureRandomString } from "@/utils/generate-secure-random-string";
import { deleteImageFromS3, uploadImageToS3 } from "@/utils/s3";
import { sendEmail } from "@/utils/sendmail";

import MemberRepository from "./repository";
import {
  MEMBER_ID_LENGTH,
  MemberSignInSchema,
  TMemberBaseSchema,
  TMemberRegisterFormSchema,
} from "./schema";

class MemberService {
  private memberRepository: MemberRepository;
  private userService: UserService;

  constructor() {
    this.memberRepository = new MemberRepository();
    this.userService = new UserService();
  }

  async isExisting(email: string): Promise<boolean> {
    try {
      const existingMember = await this.memberRepository.findByEmail(email);
      return existingMember ? true : false;
    } catch (error) {
      throw error;
    }
  }

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
<p>新規登録ありがとうございます。</p>
<p>次のリンクをクリックして登録にお進みください。</p>
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

  async getValidRegistrationToken(token: string): Promise<RegistrationToken> {
    try {
      const registrationToken =
        await this.memberRepository.findRegistrationToken(token);
      if (!registrationToken) {
        throw new AppError("BAD_REQUEST", "無効なトークンです。", "/signup");
      }
      if (registrationToken.expiresAt < new Date()) {
        throw new AppError(
          "UNAUTHORIZED",
          "有効期限切れのトークンです。",
          "/signup",
        );
      }

      return registrationToken;
    } catch (error) {
      throw error;
    }
  }
  async register(params: TMemberRegisterFormSchema): Promise<Member> {
    const memberId = await this.generateMemberId();
    const logoUploadPath = `${memberId}/logo`;
    let logoAbsolutePath: string = "";
    try {
      // logoがあれば、画像をアップロードして、そのURLを返す。データベースにはファイル名を保存する。
      if (params.logo) {
        logoAbsolutePath = await uploadImageToS3(params.logo, logoUploadPath);
      }

      // 会員登録
      const createData: TMemberBaseSchema = {
        ...params,
        id: memberId,
        logo: logoAbsolutePath,
      };
      const newMember: Member = await this.memberRepository.create(createData);

      return newMember;
    } catch (error) {
      if (logoAbsolutePath) {
        // アップロードした画像を削除
        await deleteImageFromS3(logoAbsolutePath);
      }
      throw error;
    }
  }

  async signIn(credentials: Record<"email" | "password", string>) {
    try {
      // 1. バリデーション
      const validationData = MemberSignInSchema.parse(credentials);
      // 2. ルートユーザーが存在するか
      const rootUser = await this.memberRepository.findRootUser(
        validationData.email,
      );
      // 3. もし存在しなかったら
      if (!rootUser) {
        throw new AppError("NOT_FOUND", "登録されていません。");
      }

      // 4. パスワードが正しいか
      const isValidPassword = await bcrypt.compare(
        validationData.password,
        rootUser.password,
      );

      // 5. パスワードが正しくなかったら
      if (!isValidPassword) {
        throw new AppError("UNAUTHORIZED", "パスワードが正しくありません。");
      }

      // 6. ログイン
      return rootUser;
    } catch (error) {
      throw error;
    }
  }
}

export default MemberService;
