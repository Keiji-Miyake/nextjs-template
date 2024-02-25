import { NextRequest } from "next/server";

import { ConflictError } from "@/domains/error/class/ConflictError";
import { NotFoundError } from "@/domains/error/class/NotFoundError";
import MemberService from "@/domains/member/service";
import { errorResponse, successResponse } from "@/libs/responseHandler";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-auth-token");
  const memberService = new MemberService();

  try {
    if (!token) {
      throw new NotFoundError("Tokenが見つかりません");
    }
    const registrationToken =
      await memberService.getValidRegistrationToken(token);

    // 登録済みのメールアドレスかどうかを確認する
    if (await memberService.isExisting(registrationToken.email)) {
      console.error("登録済みのメールアドレス:", registrationToken.email);
      throw new ConflictError(
        "既に登録済みです。ログインしてご利用いただけます。",
      );
    }

    return successResponse(200, registrationToken);
  } catch (error) {
    console.error("会員登録Token検証エラー:", error);
    return errorResponse(error);
  }
}
