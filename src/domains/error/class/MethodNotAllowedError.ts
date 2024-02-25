import { ErrorDictionary } from "@/config/error";

import { BaseError } from "./BaseError";

export class MethodNotAllowedError extends BaseError {
  constructor(message?: string) {
    super(ErrorDictionary.METHOD_NOT_ALLOWED, message);
  }
}
