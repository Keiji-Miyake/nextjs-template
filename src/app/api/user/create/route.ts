import { NextRequest } from "next/server";

import { HttpResponseData } from "@/config/httpResponse";
import { AppError } from "@/domains/error/class/AppError";
import UserService from "@/domains/user/service";
import { auth } from "@/libs/auth";
import { errorResponse, successResponse } from "@/libs/responseHandler";

export async function POST(req: NextRequest) {
  const userService = new UserService();
  const session = await auth();
  const memberId = session?.user.memberId;
  const formData = await req.formData();
  const data = Object.fromEntries(formData);

  try {
    if (req.method !== "POST") {
      throw new AppError("METHOD_NOT_ALLOWED");
    }
    if (!session) {
      throw new AppError("UNAUTHORIZED");
    }

    const createdUser = await userService.create(memberId, data);
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
