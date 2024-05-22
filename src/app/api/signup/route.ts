import { NextRequest } from "next/server";

import { Prisma } from "@prisma/client";

import { ConflictError } from "@/domains/error/class/ConflictError";
import MemberService from "@/domains/member/service";
import { signUpSchema } from "@/domains/signup/schema";
import { default as SignUpService } from "@/domains/signup/service";
import { errorResponse, successResponse } from "@/libs/responseHandler";
import { sendEmail } from "@/libs/sendmail";

export async function POST(req: NextRequest) {
  const signUpService = new SignUpService();
  const memberService = new MemberService();

  try {
    const signUpData = await req.json();
    const { email } = signUpSchema.parse(signUpData);

    // 登録済みのメールアドレスかどうかを確認する
    if (await memberService.isExisting(email)) {
      throw new ConflictError(
        "既に登録済みです。ログインしてご利用いただけます。",
      );
    }

    // トークン
    const token = signUpService.token;
    // 有効期限の設定
    const expiresAt = signUpService.expiresAt;
    const expireAtText = SignUpService.expiresAtText(expiresAt);

    // 受付メールを送信する。
    const text = `
新規登録ありがとうございます。
次のリンクをクリックして登録にお進みください。
${process.env.NEXT_PUBLIC_WEB_URL}/signup/${token}
URLの有効期限は${expireAtText}です。
`;
    const html = `
<p>新規登録ありがとうございます。<br>次のリンクをクリックして登録にお進みください。</p>
<p><a href="${process.env.NEXT_PUBLIC_WEB_URL}/signup/${token}">会員登録</a></p>
<p>URLの有効期限は${expireAtText}です。</p>
`;

    await sendEmail({
      to: email,
      subject: "申し込みありがとうございます。",
      text: text,
      html: html,
    });

    // SignUpToken保存
    const params: Prisma.SignUpVerificationUpsertArgs = {
      where: { email },
      update: {
        email,
        token,
        expiresAt,
      },
      create: {
        email,
        token,
        expiresAt,
      },
    };
    signUpService.save(params);

    return successResponse(200, { message: "メールを送信しました。" });
  } catch (error: unknown) {
    console.error(`POST: /api/signup: `, error);
    return errorResponse(error);
  }
}
