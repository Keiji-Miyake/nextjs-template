import { Prisma } from "@prisma/client";
import { z } from "zod";

import { ErrorDictionary, ErrorInfo } from "@/config/error";
import { BaseError } from "@/domains/error/class/BaseError";

export default function generateErrorInfo(error: unknown): ErrorInfo {
  let errorInfo: ErrorInfo;

  if (error instanceof BaseError) {
    errorInfo = ErrorDictionary[error.code];
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      errorInfo = ErrorDictionary.CONFLICT;
    } else if (error.code === "P2003") {
      errorInfo = ErrorDictionary.CONFLICT;
    } else if (error.code === "P2025") {
      errorInfo = ErrorDictionary.NOT_FOUND;
    } else {
      errorInfo = ErrorDictionary.BAD_REQUEST;
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    errorInfo = ErrorDictionary.BAD_REQUEST;
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    errorInfo = ErrorDictionary.DATABASE_ERROR;
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    errorInfo = ErrorDictionary.DATABASE_ERROR;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    errorInfo = ErrorDictionary.VALIDATION_FAILED;
  } else if (error instanceof z.ZodError) {
    errorInfo = ErrorDictionary.VALIDATION_FAILED;
    const flatErrors = error.flatten();

    if (flatErrors.formErrors.length === 0) {
      errorInfo.fieldErrors = flatErrors.fieldErrors;
    }
  } else {
    errorInfo = ErrorDictionary.INTERNAL_SERVER_ERROR;
  }

  return errorInfo;
}
