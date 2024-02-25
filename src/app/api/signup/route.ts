import { NextRequest } from "next/server";

import { HttpResponseData } from "@/config/httpResponse";
import { MethodNotAllowedError } from "@/domains/error/class/MethodNotAllowedError";
import { TMemberRegisterFormSchema } from "@/domains/member/schema";
import MemberService from "@/domains/member/service";
import { errorResponse, successResponse } from "@/libs/responseHandler";
import { formDataToObject } from "@/libs/utils";

export async function POST(req: NextRequest) {
  const memberService = new MemberService();

  const formData = await req.formData();
  const params = formDataToObject(formData) as TMemberRegisterFormSchema;

  try {
    if (req.method !== "POST") {
      throw new MethodNotAllowedError();
    }
    const registerData = await memberService.register(params);

    return successResponse(HttpResponseData.CREATED.status, registerData);
  } catch (error: any) {
    console.error("新規登録APIエラー:", error);
    return errorResponse(error);
  }
}
