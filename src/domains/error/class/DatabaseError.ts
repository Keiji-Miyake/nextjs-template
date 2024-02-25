import { ErrorDictionary } from "@/config/error";

import { BaseError } from "./BaseError";

export class DatabaseError extends BaseError {
  constructor(message?: string) {
    super(ErrorDictionary.DATABASE_ERROR, message);
  }
}
