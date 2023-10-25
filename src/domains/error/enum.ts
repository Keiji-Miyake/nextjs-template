export enum AppErrorCode {
  InternalServerError = "INTERNAL_SERVER_ERROR", // サーバーエラー
  UserNotFound = "USER_NOT_FOUND", // ユーザーが見つからない
  InvalidCredentials = "INVALID_CREDENTIALS", // 認証エラー
  ValidationFailed = "VALIDATION_FAILED", // バリデーションエラー
  DuplicateEmail = "DUPLICATE_EMAIL", // 重複エラー
  InsufficientPermissions = "INSUFFICIENT_PERMISSIONS", // アクセス権限エラー
  Timeout = "TIMEOUT",
  DatabaseError = "DATABASE_ERROR",
  RequestError = "REQUEST_ERROR",
}

// AppErrorCode と対応する HTTP ステータスコードのマッピング
export const AppErrorCodeToHttpStatusMap: Record<AppErrorCode, number> = {
  [AppErrorCode.ValidationFailed]: 400,
  [AppErrorCode.DuplicateEmail]: 409,
  [AppErrorCode.InsufficientPermissions]: 403,
  [AppErrorCode.Timeout]: 408,
  [AppErrorCode.InternalServerError]: 500,
  [AppErrorCode.UserNotFound]: 404,
  [AppErrorCode.InvalidCredentials]: 401,
  [AppErrorCode.DatabaseError]: 500,
  [AppErrorCode.RequestError]: 400,
};
