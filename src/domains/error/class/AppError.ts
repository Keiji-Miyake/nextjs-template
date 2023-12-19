import { HttpResponseData, THttpResponseCode } from "@/config/httpResponse";

export class AppError extends Error {
  code: THttpResponseCode;
  status: number;
  redirect: string | undefined;

  constructor(code: THttpResponseCode, message?: string, redirect?: string) {
    const httpResponseData = HttpResponseData[code];
    super(message || httpResponseData.message);
    this.code = code;
    this.status = httpResponseData.status;
    this.redirect = redirect;
  }
}
