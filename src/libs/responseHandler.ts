import { NextResponse } from "next/server";

import generateErrorInfo from "./error";

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

export const errorResponse = (error: unknown) => {
  const errorInfo = generateErrorInfo(error);

  return NextResponse.json(
    {
      success: false,
      ...errorInfo,
    },
    {
      status: errorInfo.code,
    },
  );
};
