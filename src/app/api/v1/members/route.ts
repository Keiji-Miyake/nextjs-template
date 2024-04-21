import { NextRequest } from "next/server";

import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

import { HttpResponseData } from "@/config/httpResponse";
import { ConflictError } from "@/domains/error/class/ConflictError";
import { memberRegisterSchema } from "@/domains/member/schema";
import MemberService from "@/domains/member/service";
import { MemberRegisterFormSchema } from "@/domains/member/type";
import { errorResponse, successResponse } from "@/libs/responseHandler";
import { deleteImageFromS3, uploadImageToS3 } from "@/libs/s3";
import { formDataToObject } from "@/libs/utils";

export async function POST(req: NextRequest) {
  const memberService = new MemberService();
  const logoUploadPath = `${memberService.memberId}/logo`;
  let logoAbsolutePath: string | undefined;

  const formData = await req.formData();
  const formDataObject = formDataToObject(formData) as MemberRegisterFormSchema;

  try {
    // バリデーション
    const { password, ...validatedData } =
      memberRegisterSchema.parse(formDataObject);
    delete validatedData.confirmPassword;

    // メールアドレスが既に登録済みでないか
    if (await memberService.isExisting(validatedData.email)) {
      console.error("登録済みのメールアドレス:", validatedData.email);
      throw new ConflictError(
        "既に登録済みです。ログインしてご利用いただけます。",
      );
    }

    // logoがあれば、画像をアップロードして、そのURLを返す。データベースにはファイル名を保存する。
    if (validatedData.logo instanceof File) {
      logoAbsolutePath = await uploadImageToS3(
        validatedData.logo,
        logoUploadPath,
      );
    }

    const params: Prisma.MemberCreateInput = {
      ...validatedData,
      id: memberService.memberId,
      logo: logoAbsolutePath,
      users: {
        create: {
          name: validatedData.name,
          email: validatedData.email,
          password: await bcrypt.hash(password, 10),
          role: "ROOT",
          profileIcon: logoAbsolutePath,
        },
      },
    };

    const member = await memberService.register(params);

    return successResponse(HttpResponseData.CREATED.status, member);
  } catch (error: any) {
    console.error("POST: /api/v1/member", error);
    if (logoAbsolutePath) {
      // アップロードした画像を削除
      await deleteImageFromS3(logoAbsolutePath);
    }
    return errorResponse(error);
  }
}
