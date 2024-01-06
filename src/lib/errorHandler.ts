import { Prisma } from "@prisma/client";
import { z } from "zod";

import { THttpResponseCode } from "@/config/httpResponse";
import { AppError } from "@/domains/error/class/AppError";
import { TErrorData } from "@/domains/error/type";

export default function handleErrors(error: unknown) {
  let errorCode: THttpResponseCode;
  let errorData: TErrorData;

  if (error instanceof AppError) {
    errorCode = error.code;
    errorData = {
      message: error.message,
      error,
      redirect: error.redirect,
    };
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // リクエストが不正であることを示すエラー
    errorCode = "BAD_REQUEST";
    errorData = {
      code: error.code,
      message: "不正なリクエストです。",
      error,
    };
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    // エラーコードを持たないリクエストに関連するエラーを処理
    errorCode = "BAD_REQUEST";
    errorData = {
      message: "不正なリクエストです。",
      error,
    };
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    // エンジンのクラッシュを処理
    errorCode = "DATABASE_ERROR";
    errorData = {
      message: "データベースでエラーが発生しました。",
      error,
    };
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    // クエリエンジンの起動やデータベース接続の問題を処理
    errorCode = "DATABASE_ERROR";
    errorData = {
      message: "データベースでエラーが発生しました。",
      error,
    };
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // バリデーションエラーを処理
    errorCode = "VALIDATION_FAILED";
    errorData = {
      message: "入力内容に誤りがあります。",
      error,
    };
  } else if (error instanceof z.ZodError) {
    errorCode = "VALIDATION_FAILED";
    const flatErrors = error.flatten();

    // ルートエラー
    if (flatErrors.formErrors.length !== 0) {
      errorData = {
        message: "入力内容に誤りがあります。",
        error,
      };
    } else {
      errorData = {
        message: "入力内容に誤りがあります。",
        error,
        zodErrors: flatErrors.fieldErrors,
      };
    }
  } else {
    errorCode = "INTERNAL_SERVER_ERROR";
    errorData = {
      message: "予期せぬエラーが発生しました。",
      error,
    };
  }

  return { errorCode, errorData };
}
