import { NextRequest, NextResponse } from "next/server";

import { AppError } from "@/domains/error/class/AppError";
import { MemberSignUpSchema } from "@/domains/member/schema";
import MemberService from "@/domains/member/service";
import { errorResponse } from "@/libs/responseHandler";

export async function POST(req: NextRequest) {
  const memberService = new MemberService();
  const signUpData = await req.json();

  try {
    if (req.method !== "POST") {
      throw new AppError("METHOD_NOT_ALLOWED");
    }
    const validatedData = MemberSignUpSchema.parse(signUpData);
    // 登録済みのメールアドレスかどうかを確認する
    if (await memberService.isExisting(validatedData.email)) {
      console.error("登録済みのメールアドレス:", validatedData.email);
      throw new AppError(
        "CONFLICT",
        "既に登録済みです。ログインしてご利用いただけます。",
        "/login",
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
