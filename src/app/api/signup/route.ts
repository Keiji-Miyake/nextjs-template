import { NextRequest } from "next/server";

import { HttpResponseData } from "@/config/httpResponse";
import { AppError } from "@/domains/error/class/AppError";
import { MemberRegisterPostSchema } from "@/domains/member/schema";
import MemberService from "@/domains/member/service";
import { errorResponse, successResponse } from "@/lib/responseHandler";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    console.error("Invalid method");
    throw new AppError("METHOD_NOT_ALLOWED");
  }
  const memberService = new MemberService();

  const formData = await req.formData();
  const payload = Object.fromEntries(formData);
  console.debug("payload:", payload);

  try {
    const validatedData = MemberRegisterPostSchema.parse(payload);

    // メールアドレスが既に登録済みでないか
    if (await memberService.isExisting(validatedData.email)) {
      console.error("登録済みのメールアドレス:", validatedData.email);
      throw new AppError(
        "CONFLICT",
        "既に登録済みです。ログインしてご利用いただけます。",
        "/login",
      );
    }

    const registerData = await memberService.register(validatedData);

    return successResponse(HttpResponseData.CREATED.status, registerData);
  } catch (error: any) {
    console.error("新規申込APIエラー:", error);
    return errorResponse(error);
  }
}
