import { ErrorDictionary } from "@/config/error";

import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message?: string) {
    super(ErrorDictionary.BAD_REQUEST, message);
  }
}
