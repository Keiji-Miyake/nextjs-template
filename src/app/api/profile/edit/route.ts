import { NextRequest } from "next/server";

import { AppError } from "@/domains/error/class/AppError";
import { UserProfilePutSchema } from "@/domains/user/schema";
import { auth } from "@/libs/auth";
import { prisma } from "@/libs/prisma";
import { errorResponse, successResponse } from "@/libs/responseHandler";
import { uploadImageToS3 } from "@/libs/s3";

export async function PUT(req: NextRequest) {
  const session = await auth();
  const formData = await req.formData();
  const data = Object.fromEntries(formData);

  try {
    if (req.method !== "PUT") {
      throw new AppError("METHOD_NOT_ALLOWED");
    }
    if (!session) {
      throw new AppError("UNAUTHORIZED");
    }

    const user = "user" in session ? session.user : null;
    // バリデーション
    const validatedData = UserProfilePutSchema.parse(data);

    // profileIconがあれば、画像をアップロードして、そのURLを返す。データベースにはファイル名を保存する。
    if (validatedData.profileIcon) {
      const s3Response = await uploadImageToS3(validatedData.profileIcon);
      console.debug("S3アップロード結果:", s3Response);
    }
    // アップロードに成功したら、データベースに保存する
    await prisma.user.update({
      where: { id: Number(user.id) },
      data: {
        ...validatedData,
        profileIcon: validatedData.profileIcon
          ? validatedData.profileIcon.name
          : null,
      },
    });

    return successResponse(200, user);
  } catch (error) {
    console.error("会員情報編集エラー:", error);
    // もし画像アップロードに成功していたら、画像を削除する

    return errorResponse(error);
  }
}
