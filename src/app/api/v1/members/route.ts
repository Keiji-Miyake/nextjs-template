import { NextRequest } from "next/server";

import { getServerSession } from "next-auth";

import { HttpResponseData } from "@/config/httpResponse";
import { InternalServerError } from "@/domains/error/class/InternalServerError";
import UserService from "@/domains/user/service";
import { errorResponse, successResponse } from "@/libs/responseHandler";

export async function POST(request: NextRequest) {
  const userService = new UserService();

  const formData = await request.formData();

  try {
    const session = await getServerSession();
    const memberId = session?.user.memberId;
    formData.append("memberId", memberId);
    const params = Object.fromEntries(formData);
    const createdUser = await userService.create(params);
    if (createdUser === null) {
      throw new InternalServerError("ユーザー作成に失敗しました。");
    }

    return successResponse(HttpResponseData.CREATED.status, createdUser);
  } catch (error) {
    console.error("ユーザー作成失敗:", error);
    return errorResponse(error);
  }
}
