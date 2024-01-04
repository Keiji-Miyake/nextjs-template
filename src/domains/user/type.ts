export const ROLE_NAME = {
  MEMBER: "メンバー",
  ADMIN: "管理者",
  ROOT: "ルートユーザー",
} as const;
export type RoleName = (typeof ROLE_NAME)[keyof typeof ROLE_NAME];
