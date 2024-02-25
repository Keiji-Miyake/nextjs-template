import { ErrorInfo } from "@/config/error";

export class BaseError extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly code: number;

  constructor(errorInfo: ErrorInfo, message?: string) {
    super(errorInfo.message);
    this.name = errorInfo.name;
    this.message = errorInfo.message || message || "エラーが発生しました";
    this.code = errorInfo.code;

    // Set the prototype explicitly (only required in some environments)
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}
