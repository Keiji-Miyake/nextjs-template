import "server-only";

import { Prisma, User } from "@prisma/client";
import { Record } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";

import { ConflictError } from "@/domains/error/class/ConflictError";
import { NotFoundError } from "@/domains/error/class/NotFoundError";
import UserRepository from "@/domains/user/repository";
import { UserCreatePostSchema } from "@/domains/user/schema";
import { prisma } from "@/libs/prisma";
import { deleteImageFromS3, uploadImageToS3 } from "@/libs/s3";

import { BadRequestError } from "../error/class/BadRequestError";

import type { UserProfile } from "@/domains/user/type";

class UserService {
  protected userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * 存在するユーザーかどうか
   * @param {string} email
   * @param {string} memberId
   * @returns
   */
  async isExistingUser(email: string, memberId: string): Promise<boolean> {
    const existingUser = await this.userRepository.findUnique(email, memberId);
    return existingUser ? true : false;
  }

  /**
   * プロフィールを取得
   * @param {string} authId
   * @returns
   */
  async getProfile(authId: number): Promise<UserProfile | null> {
    return await prisma.user.findUnique({
      where: { id: authId },
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
  }

  /**
   * ユーザー作成
   * @param data
   * @returns
   */
  async create(data: {
    [k: string]: FormDataEntryValue;
  }): Promise<User | null> {
    const memberId = data.memberId as string;
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
      if (profileIcon instanceof File) {
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

  /**
   * 会員に紐づくユーザーを全て取得
   * @param memberId
   * @returns
   */
  async getAllForMember(memberId: string): Promise<User[] | null> {
    if (!memberId) return null;

    return await this.userRepository.findManyForMember(memberId);
  }

  /**
   * 一覧取得
   * @param memberId R
   * @param searchQuery
   * @param perPage
   * @returns users, totalCount
   * @throws
   */
  async getList(
    memberId: string,
    searchParams: URLSearchParams,
    perPage: number,
  ): Promise<User[] | null> {
    return await this.userRepository.getList(memberId, searchParams, perPage);
  }

  /**
   * サインイン
   * @param credentials
   * @returns Promise<Member>
   * @throws Error
   */
  async rootSignIn(credentials: Record<"email" | "password", string>) {
    try {
      // 1. ルートユーザーが存在するか
      const rootUser = await this.userRepository.findRootUser({
        email: credentials.email,
      });
      // 3. もし存在しなかったら
      if (!rootUser) {
        throw new NotFoundError("登録されていません。");
      }

      // 4. パスワードが正しいか
      const isValidPassword = await bcrypt.compare(
        credentials.password,
        rootUser.password,
      );

      // 5. パスワードが正しくなかったら
      if (!isValidPassword) {
        throw new BadRequestError("パスワードが正しくありません。");
      }

      // 6. ログイン
      return rootUser;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
