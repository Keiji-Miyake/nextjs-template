import { NextRequest } from "next/server";

import { ConflictError } from "@/domains/error/class/ConflictError";
import { NotFoundError } from "@/domains/error/class/NotFoundError";
import MemberService from "@/domains/member/service";
import SignUpService from "@/domains/signup/service";
import { errorResponse, successResponse } from "@/libs/responseHandler";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-auth-token");
  const signUpService = new SignUpService();
  const memberService = new MemberService();

  try {
    if (!token) {
      throw new NotFoundError("Tokenが見つかりません");
    }
    const signUpVerification = await signUpService.get(token);
    if (!signUpVerification) {
      throw new NotFoundError("Tokenが見つかりません");
    }

    // 登録済みのメールアドレスかどうかを確認する
    if (await memberService.isExisting(signUpVerification.email)) {
      console.error("登録済みのメールアドレス:", signUpVerification.email);
      throw new ConflictError(
        "既に登録済みです。ログインしてご利用いただけます。",
      );
    }

    return successResponse(200, { email: signUpVerification.email });
  } catch (error) {
    console.error("会員登録Token検証エラー:", error);
    return errorResponse(error);
  }
}
