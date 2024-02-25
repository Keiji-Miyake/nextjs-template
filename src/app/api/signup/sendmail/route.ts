import { NextRequest, NextResponse } from "next/server";

import { ConflictError } from "@/domains/error/class/ConflictError";
import { MethodNotAllowedError } from "@/domains/error/class/MethodNotAllowedError";
import { MemberSignUpSchema } from "@/domains/member/schema";
import MemberService from "@/domains/member/service";
import { errorResponse } from "@/libs/responseHandler";

export async function POST(req: NextRequest) {
  const memberService = new MemberService();
  const signUpData = await req.json();

  try {
    if (req.method !== "POST") {
      throw new MethodNotAllowedError();
    }
    const validatedData = MemberSignUpSchema.parse(signUpData);
    // 登録済みのメールアドレスかどうかを確認する
    if (await memberService.isExisting(validatedData.email)) {
      console.error("登録済みのメールアドレス:", validatedData.email);
      throw new ConflictError(
        "既に登録済みです。ログインしてご利用いただけます。",
      );
    }

    const sendMail = await memberService.sendRegistrationEmail(
      validatedData.email,
    );

    return NextResponse.json(sendMail, { status: 201 });
  } catch (error: unknown) {
    console.error("会員申込APIエラー:", error);
    return errorResponse(error);
  }
}
