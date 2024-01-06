import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import "server-only";

import { AppError } from "@/domains/error/class/AppError";
import UserRepository from "@/domains/user/repository";
import { prisma } from "@/lib/prisma";
import { deleteImageFromS3, uploadImageToS3 } from "@/lib/s3";

import { UserCreatePostSchema } from "./schema";
class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async isExistingUser(email: string): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      return existingUser ? true : false;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param data
   * @returns
   */
  async create(data: {
    [k: string]: FormDataEntryValue;
  }): Promise<User | null> {
    let profileIconPath = "";
    console.debug("ユーザー作成開始:", data);
    try {
      // バリデーション
      const { profileIcon, ...validatedData } =
        UserCreatePostSchema.parse(data);
      delete validatedData.confirmPassword;

      // 会員内のユーザーで同じemailが存在しないか確認する
      const user = await prisma.user.findUnique({
        where: {
          UniqueMemberEmail: {
            email: validatedData.email,
            memberId: validatedData.memberId,
          },
        },
      });
      if (user) {
        throw new AppError(
          "CONFLICT",
          "既に登録済みです。ログインしてご利用いただけます。",
        );
      }

      // プロフィール画像をアップロードする。失敗しても処理は続行する
      const fileUploadPath = `${data.memberId}/user/${data.email}`;
      if (profileIcon) {
        profileIconPath = await uploadImageToS3(profileIcon, fileUploadPath);
      }
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const userData = {
        ...validatedData,
        password: hashedPassword,
        profileIcon: profileIconPath,
      };

      const newUser = await this.userRepository.save(userData);
      return newUser;
    } catch (error) {
      if (profileIconPath) {
        await deleteImageFromS3(profileIconPath);
      }
      throw error;
    }
  }

  async getMemberUsers(memberId: string): Promise<User[] | null> {
    if (!memberId) return null;
    try {
      const users = await this.userRepository.findByMemberId(memberId);
      return users;
    } catch (error) {
      throw error;
    }
  }

  /**
   * ページネーションを考慮したユーザー一覧取得
   * @param memberId
   * @param page
   * @param perPage
   * @returns
   * @throws
   */
  async getUsersWithPagination(
    memberId: string,
    page: number,
    perPage: number,
  ): Promise<User[] | null> {
    if (!memberId) return null;
    try {
      const users = await this.userRepository.findByMemberIdWithPagination(
        memberId,
        page,
        perPage,
      );
      return users;
    } catch (error) {
      console.error("ユーザー一覧取得失敗", error);
      throw error;
    }
  }
}

export default UserService;
