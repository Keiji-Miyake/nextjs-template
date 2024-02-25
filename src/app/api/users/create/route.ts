import { NextRequest } from "next/server";

import { HttpResponseData } from "@/config/httpResponse";
import { InternalServerError } from "@/domains/error/class/InternalServerError";
import { MethodNotAllowedError } from "@/domains/error/class/MethodNotAllowedError";
import { UnauthorizedError } from "@/domains/error/class/UnauthorizedError";
import UserService from "@/domains/user/service";
import { auth } from "@/libs/auth";
import { errorResponse, successResponse } from "@/libs/responseHandler";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    throw new MethodNotAllowedError();
  }

  const userService = new UserService();

  const session = await auth();
  if (!session) {
    throw new UnauthorizedError();
  }
  const memberId = session?.user.memberId;

  const formData = await req.formData();
  const payload = Object.fromEntries(formData);

  try {
    const createdUser = await userService.create(memberId, payload);
    if (createdUser === null) {
      throw new InternalServerError("ユーザー作成に失敗しました。");
    }

    return successResponse(HttpResponseData.CREATED.status, createdUser);
  } catch (error) {
    console.error("ユーザー作成失敗:", error);
    return errorResponse(error);
  }
}
