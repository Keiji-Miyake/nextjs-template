import { ErrorDictionary } from "@/config/error";

import { BaseError } from "./BaseError";

export class ValidationFailedError extends BaseError {
  constructor(message?: string) {
    super(ErrorDictionary.VALIDATION_FAILED, message);
  }
}
