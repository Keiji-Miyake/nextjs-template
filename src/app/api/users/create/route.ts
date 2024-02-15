import { NextRequest } from "next/server";

import { HttpResponseData } from "@/config/httpResponse";
import { AppError } from "@/domains/error/class/AppError";
import UserService from "@/domains/user/service";
import { auth } from "@/libs/auth";
import { errorResponse, successResponse } from "@/libs/responseHandler";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    throw new AppError("METHOD_NOT_ALLOWED");
  }

  const userService = new UserService();

  const session = await auth();
  if (!session) {
    throw new AppError("UNAUTHORIZED");
  }
  const memberId = session?.user.memberId;

  const formData = await req.formData();
  const payload = Object.fromEntries(formData);

  try {
    const createdUser = await userService.create(memberId, payload);
    if (createdUser === null) {
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "ユーザー作成に失敗しました。",
      );
    }

    return successResponse(HttpResponseData.CREATED.status, createdUser);
  } catch (error) {
    console.error("ユーザー作成失敗:", error);
    return errorResponse(error);
  }
}
