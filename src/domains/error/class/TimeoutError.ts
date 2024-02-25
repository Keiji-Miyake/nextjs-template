import { ErrorDictionary } from "@/config/error";

import { BaseError } from "./BaseError";

export class TimeoutError extends BaseError {
  constructor(message?: string) {
    super(ErrorDictionary.TIMEOUT, message);
  }
}
