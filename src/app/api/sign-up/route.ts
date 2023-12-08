import { NextRequest, NextResponse } from "next/server";

import UserService from "@/domains/user/service";
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

  const userService = new UserService(prisma);

  try {
    const validatedData = userService.validateSignUpData(signUpData);

    if (await userService.isExistingUser(validatedData.email)) {
      console.error("Duplicate email");
      return successResponse(200, {
        existing: true,
      });
    }

    const newUser = await userService.signUpUser(validatedData);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("会員登録エラー:", error);
    return errorResponse(error);
  }
}
