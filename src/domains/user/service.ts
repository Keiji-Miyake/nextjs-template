import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import "server-only";

import { ConflictError } from "@/domains/error/class/ConflictError";
import UserRepository from "@/domains/user/repository";
import { UserCreatePostSchema } from "@/domains/user/schema";
import generateErrorInfo from "@/libs/error";
import { deleteImageFromS3, uploadImageToS3 } from "@/libs/s3";

import { TFetchUsersPageResult } from "../error/type";

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async isExistingUser(email: string, memberId: string): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findUnique(
        email,
        memberId,
      );
      return existingUser ? true : false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * ユーザー作成
   * @param data
   * @returns
   */
  async create(
    memberId: string,
    data: {
      [k: string]: FormDataEntryValue;
    },
  ): Promise<User | null> {
    const fileUploadPath = `${memberId}/user/${data.email}`;
    let profileIconPath = "";
    console.debug("ユーザー作成開始:", data);
    try {
      // バリデーション
      const { profileIcon, ...validatedData } =
        UserCreatePostSchema.parse(data);
      delete validatedData.confirmPassword;

      // 会員内のユーザーで同じemailが存在しないか確認する
      const user = await this.userRepository.findUnique(
        validatedData.email,
        memberId,
      );
      if (user) {
        throw new ConflictError(
          "既に登録済みです。ログインしてご利用いただけます。",
        );
      }

      // userDataを作成する
      const userData: Prisma.UserCreateInput = {
        ...validatedData,
        password: await bcrypt.hash(validatedData.password, 10),
        member: {
          connect: {
            id: memberId,
          },
        },
      };

      // プロフィール画像をアップロードする。失敗しても処理は続行する
      if (profileIcon) {
        userData.profileIcon = await uploadImageToS3(
          profileIcon,
          fileUploadPath,
        );
        profileIconPath = userData.profileIcon;
      }

      const newUser = await this.userRepository.create(userData);
      return newUser;
    } catch (error) {
      if (profileIconPath) {
        await deleteImageFromS3(profileIconPath);
      }
      throw error;
    }
  }

  async fetchUsers(memberId: string): Promise<User[] | null> {
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
   * @returns users, totalCount
   * @throws
   */
  async fetchUsersPage(
    memberId: string,
    page: number,
    perPage: number,
  ): Promise<TFetchUsersPageResult> {
    try {
      const users = await this.userRepository.findByMemberIdWithPagination(
        memberId,
        page,
        perPage,
      );
      const totalCount = await this.userRepository.countByMemberId(memberId);
      return { success: true, users, totalCount };
    } catch (error) {
      const errorInfo = generateErrorInfo(error);
      return { success: false, errorInfo };
    }
  }
}

export default UserService;
