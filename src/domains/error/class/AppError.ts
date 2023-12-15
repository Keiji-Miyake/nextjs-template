import { AppErrorCode, AppErrorConfig } from "../config";

export class AppError extends Error {
  code: AppErrorCode;
  status: number;
  redirect: string | undefined;

  constructor(code: AppErrorCode, message?: string, redirect?: string) {
    const errorConfig = AppErrorConfig[code];
    super(message || errorConfig.message);
    this.redirect = redirect;
    this.code = code;
    this.status = errorConfig.status;
  }
}
