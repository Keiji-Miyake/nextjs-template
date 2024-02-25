import { ErrorDictionary } from "@/config/error";

import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
  constructor(message?: string) {
    super(ErrorDictionary.FORBIDDEN, message);
  }
}
