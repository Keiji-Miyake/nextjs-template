import { NextRequest } from "next/server";

import { HttpResponseData } from "@/config/httpResponse";
import { USERS_PER_PAGE } from "@/config/site";
import { InternalServerError } from "@/domains/error/class/InternalServerError";
import UserService from "@/domains/user/service";
import { getServerSession } from "@/libs/auth";
import { errorResponse, successResponse } from "@/libs/responseHandler";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.debug(searchParams);
  const userService = new UserService();

  try {
    const session = await getServerSession();
    const memberId = session?.user.memberId;
    const users = await userService.getList(
      memberId,
      searchParams,
      USERS_PER_PAGE,
    );
    return successResponse(HttpResponseData.OK.status, users);
  } catch (error) {
    console.error("ユーザー取得失敗:", error);
    return errorResponse(error);
  }
}

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
