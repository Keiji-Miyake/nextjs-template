import { Group } from "@prisma/client";

export const ROLE_NAME = {
  MEMBER: "メンバー",
  ADMIN: "管理者",
  ROOT: "ルートユーザー",
} as const;
export type RoleName = (typeof ROLE_NAME)[keyof typeof ROLE_NAME];

export type UserProfile = {
  id: number;
  name: string | null;
  email: string;
  profileIcon: string | null;
  updatedAt: Date;
  deletedAt: Date | null;
  groups: Group[];
};

export type CreateUserInput = {
  memberId: string;
  name: string;
  email: string;
  password: string;
  role: RoleName;
  profileIcon: File | null;
};

export type SearchParams = {
  page?: number;
};
