import { ErrorDictionary } from "@/config/error";

import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(message?: string) {
    super(ErrorDictionary.NOT_FOUND, message);
  }
}
