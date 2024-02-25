import { ErrorDictionary } from "@/config/error";

import { BaseError } from "./BaseError";

export class ConflictError extends BaseError {
  constructor(message?: string) {
    super(ErrorDictionary.CONFLICT, message);
  }
}
