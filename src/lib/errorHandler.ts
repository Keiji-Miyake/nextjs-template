import { Prisma } from "@prisma/client";
import { z } from "zod";

import { THttpResponseCode } from "@/config/httpResponse";
import { AppError } from "@/domains/error/class/AppError";

export default function handleErrors(error: unknown) {
  let errorCode: THttpResponseCode;
  let errorData: {
    code?: string;
    messages: string[];
    zodErrors?: {
      [x: string]: string[] | undefined;
      [x: number]: string[] | undefined;
      [x: symbol]: string[] | undefined;
    };
  };

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // リクエストが不正であることを示すエラー
    errorCode = "BAD_REQUEST";
    errorData = {
      code: error.code,
      messages: [error.message],
    };
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    // エラーコードを持たないリクエストに関連するエラーを処理
    errorCode = "BAD_REQUEST";
    errorData = {
      messages: [error.message],
    };
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    // エンジンのクラッシュを処理
    errorCode = "DATABASE_ERROR";
    errorData = {
      messages: [error.message],
    };
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    // クエリエンジンの起動やデータベース接続の問題を処理
    errorCode = "DATABASE_ERROR";
    errorData = {
      messages: [error.message],
    };
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // バリデーションエラーを処理
    errorCode = "VALIDATION_FAILED";
    errorData = {
      messages: [error.message],
    };
  } else if (error instanceof z.ZodError) {
    errorCode = "VALIDATION_FAILED";

    const flatErrors = error.flatten();

    // ルートエラー
    if (flatErrors.formErrors.length !== 0) {
      errorData = {
        messages: flatErrors.formErrors,
      };
    } else {
      errorData = {
        messages: ["入力内容に誤りがあります。", "入力をやり直してください。"],
        zodErrors: flatErrors.fieldErrors,
      };
    }
  } else if (error instanceof AppError) {
    errorCode = error.code;
    errorData = {
      ...error,
      messages: [error.message],
    };
  } else {
    errorCode = "INTERNAL_SERVER_ERROR";
    errorData = {
      messages: [
        "サーバーでエラーが発生しました。",
        "時間をおいて再度お試しください。",
        `エラー: ${error}`,
      ],
    };
  }

  return { errorCode, errorData };
}
