export type HttpResponse = {
  message: string;
  status: number;
};

export const HttpResponseData: { [key: string]: HttpResponse } = {
  OK: {
    message: "OK",
    status: 200,
  },
  CREATED: {
    message: "Created",
    status: 201,
  },
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

export type THttpResponseCode = keyof typeof HttpResponseData;
