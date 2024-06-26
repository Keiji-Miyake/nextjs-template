import { clsx } from "clsx";
import crypto from "crypto";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

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
