// User情報を取得するAPIを作成する

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/utils/response";

export async function GET(
  req: NextResponse,
  { params }: { params: { id: number } },
) {
  console.log("params.id:", params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        profileIcon: true,
      },
    });
    console.log("user:", user);

    if (!user) {
      throw new Error("会員情報が見つかりませんでした。");
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("会員情報取得エラー:", error);
    return errorResponse(error);
  }
}
