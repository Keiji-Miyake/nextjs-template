// response.ts

import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  AppErrorCode,
  AppErrorCodeToHttpStatusMap,
} from "@/domains/error/enum";

/**
 * HTTP response status codes.
 * @reference: https://developer.mozilla.org/ja/docs/Web/HTTP/Status
 */
export const HttpStatusCode: { [key: number]: string } = {
  200: "The request was successful",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Resource Not Found",
  405: "Method Not Allowed",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

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
  let errorCode = AppErrorCode.InternalServerError;
  let errorData = {};

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // リクエストが不正であることを示すエラー
    errorCode = AppErrorCode.RequestError;
    errorData = {
      code: error.code,
      messages: [error.message],
    };
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    // エラーコードを持たないリクエストに関連するエラーを処理
    errorCode = AppErrorCode.RequestError;
    errorData = {
      messages: [error.message],
    };
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    // エンジンのクラッシュを処理
    errorCode = AppErrorCode.DatabaseError;
    errorData = {
      messages: [error.message],
    };
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    // クエリエンジンの起動やデータベース接続の問題を処理
    errorCode = AppErrorCode.DatabaseError;
    errorData = {
      messages: [error.message],
    };
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // バリデーションエラーを処理
    errorCode = AppErrorCode.ValidationFailed;
    errorData = {
      messages: [error.message],
    };
  } else if (error instanceof z.ZodError) {
    errorCode = AppErrorCode.ValidationFailed;

    const flatErrors = error.flatten();
    console.error(flatErrors);

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
  } else {
    errorData = {
      messages: ["サーバーでエラーが発生しました。"],
    };
  }

  return NextResponse.json(
    {
      success: false,
      code: errorCode,
      error: errorData,
    },
    {
      status: AppErrorCodeToHttpStatusMap[errorCode],
    },
  );
};
