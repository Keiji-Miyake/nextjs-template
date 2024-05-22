import { ErrorInfo } from "@/config/error";

export class BaseError extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly code: number;

  constructor(errorInfo: ErrorInfo, message: string = errorInfo.message) {
    super(message);
    this.name = errorInfo.name;
    this.message = message;
    this.code = errorInfo.code;

    // Set the prototype explicitly (only required in some environments)
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  public errorInfo(): ErrorInfo {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
    };
  }
}
