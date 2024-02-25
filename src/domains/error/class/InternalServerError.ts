import { ErrorDictionary } from "@/config/error";

import { BaseError } from "./BaseError";

export class InternalServerError extends BaseError {
  constructor(message?: string) {
    super(ErrorDictionary.INTERNAL_SERVER_ERROR, message);
  }
}
