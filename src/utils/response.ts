import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";
import { z } from "zod";

import { AppError } from "@/domains/error/class/AppError";
import { AppErrorCode, AppErrorConfig } from "@/domains/error/config";

export const successResponse = <T = unknown>(
  code: number,
  data: T[] | T | undefined = undefined,
) => {
  return NextResponse.json(
    {
      success: true,
      data: data,
    },
    { status: code },
  );
};

export const errorResponse = <T = unknown>(
  error: T[] | T | undefined = undefined,
) => {
  let errorCode: AppErrorCode;
  let errorData = {};

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

  return NextResponse.json(
    {
      success: false,
      code: errorCode,
      error: errorData,
    },
    {
      status: AppErrorConfig[errorCode].status,
    },
  );
};
