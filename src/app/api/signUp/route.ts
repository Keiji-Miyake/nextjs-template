import { NextRequest, NextResponse } from "next/server";

import MemberService from "@/domains/member/service";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/utils/response";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    console.error("Invalid method");
    return NextResponse.json(
      { success: false, errors: "無効なメソッドです。" },
      { status: 405 },
    );
  }

  const signUpData = await req.json();
  // debug
  // const signUpData = {
  //   email: "debug",
  //   password: "debug",
  //   confirmPassword: "debug1",
  // };

  const memberService = new MemberService(prisma);

  console.log(signUpData);

  try {
    const validatedData = memberService.validateSignUpData(signUpData);

    if (await memberService.isExistingMember(validatedData.email)) {
      console.error("Duplicate email");
      return successResponse(200, {
        existing: true,
      });
    }

    const newMember = await memberService.registerMember(validatedData);

    return NextResponse.json(newMember, { status: 201 });
  } catch (error: any) {
    console.error("会員登録エラー:", error);
    return errorResponse(error);
  }
}
