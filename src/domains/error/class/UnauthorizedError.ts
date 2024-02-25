import { ErrorDictionary } from "@/config/error";

import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
  constructor(message?: string) {
    super(ErrorDictionary.UNAUTHORIZED, message);
  }
}
