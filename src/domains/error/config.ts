/**
 * HTTP response status codes.
 * @reference: https://developer.mozilla.org/ja/docs/Web/HTTP/Status
 */
export const HttpStatusCode: { [key: number]: string } = {
  200: "The request was successful",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Resource Not Found",
  405: "Method Not Allowed",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

export const AppErrorConfig = {
  BAD_REQUEST: {
    message: "リクエストエラー",
    status: 400,
  },
  VALIDATION_FAILED: {
    message: "バリデーションエラー",
    status: 400,
  },
  UNAUTHORIZED: {
    message: "認証エラー",
    status: 401,
  },
  FORBIDDEN: {
    message: "アクセス権限がありません。",
    status: 403,
  },
  NOT_FOUND: {
    message: "見つかりません。",
    status: 404,
  },
  METHOD_NOT_ALLOWED: {
    message: "許可されていないメソッドです。",
    status: 405,
  },
  TIMEOUT: {
    message: "タイムアウトしました。",
    status: 408,
  },
  CONFLICT: {
    message: "重複しています。",
    status: 409,
  },
  INTERNAL_SERVER_ERROR: {
    message: "サーバーエラー",
    status: 500,
  },
  DATABASE_ERROR: {
    message: "データベースエラー",
    status: 500,
  },
};
