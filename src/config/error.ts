// アプリケーションエラー設定
export interface ErrorInfo {
  name: string;
  code: number;
  message: string;
  fieldErrors?: {
    [x: string]: string[] | undefined;
    [x: number]: string[] | undefined;
    [x: symbol]: string[] | undefined;
  };
}

export const ErrorDictionary: Record<string, ErrorInfo> = {
  BAD_REQUEST: {
    name: "BAD_REQUEST",
    code: 400,
    message: "リクエストエラー",
  },
  VALIDATION_FAILED: {
    name: "VALIDATION_FAILED",
    code: 400,
    message: "バリデーションエラー",
  },
  UNAUTHORIZED: {
    name: "UNAUTHORIZED",
    code: 401,
    message: "認証エラー",
  },
  FORBIDDEN: {
    name: "FORBIDDEN",
    code: 403,
    message: "アクセス権限がありません。",
  },
  NOT_FOUND: {
    name: "NOT_FOUND",
    code: 404,
    message: "見つかりません。",
  },
  METHOD_NOT_ALLOWED: {
    name: "METHOD_NOT_ALLOWED",
    code: 405,
    message: "許可されていないメソッドです。",
  },
  TIMEOUT: {
    name: "TIMEOUT",
    code: 408,
    message: "タイムアウトしました。",
  },
  CONFLICT: {
    name: "CONFLICT",
    code: 409,
    message: "重複しています。",
  },
  INTERNAL_SERVER_ERROR: {
    name: "INTERNAL_SERVER_ERROR",
    code: 500,
    message: "サーバーエラー",
  },
  DATABASE_ERROR: {
    name: "DATABASE_ERROR",
    code: 500,
    message: "データベースエラー",
  },
};
