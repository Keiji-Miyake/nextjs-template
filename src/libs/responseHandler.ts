import { NextResponse } from "next/server";

import { HttpResponseData } from "@/config/httpResponse";

import handleErrors from "./errorHandler";

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
  const { errorCode, errorData } = handleErrors(error);

  return NextResponse.json(
    {
      success: false,
      code: errorCode,
      error: errorData,
    },
    {
      status: HttpResponseData[errorCode].status,
    },
  );
};
