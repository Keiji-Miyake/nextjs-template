import { clsx, type ClassValue } from "clsx";
import crypto from "crypto";
import { twMerge } from "tailwind-merge";

import { UserProfile } from "@/domains/user/type";

import { prisma } from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 安全なランダム文字列を生成して返す
 * @param length 文字列の長さ
 * @returns ランダム文字列
 * @throws {Error} ランダム文字列の生成に失敗した場合
 */
export const generateSecureRandomString = async (
  length: number,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (error, buffer) => {
      if (error) reject(error);
      resolve(buffer.toString("hex").slice(0, length));
    });
  });
};

/**
 * FormDataをobjectに変換
 * @param formData
 * @returns object
 * @throws Error
 */
export const formDataToObject = (formData: FormData): Record<string, unknown> =>
  Object.fromEntries(formData.entries());

/**
 * プロフィールを取得
 * @param userId
 * @returns プロフィール
 */
export const getProfile = async (
  userId: number,
): Promise<UserProfile | null> => {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileIcon: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        groups: true,
      },
    });
  } catch (error) {
    console.error("プロフィール取得エラー:", error);
    throw error;
  }
};
