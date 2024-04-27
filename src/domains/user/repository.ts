import "server-only";

import { Prisma, PrismaClient, Role, User as UserModel } from "@prisma/client";
import dayjs from "dayjs";

import { prisma } from "@/libs/prisma";

class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findRootUser(params: {
    memberId?: string;
    email?: string;
  }): Promise<UserModel | null> {
    const { memberId, email } = params;
    return await this.prisma.user.findFirst({
      where: {
        role: Role.ROOT,
        OR: [{ memberId }, { email }],
      },
    });
  }

  async findUnique(memberId: string, email: string): Promise<UserModel | null> {
    return await this.prisma.user.findUnique({
      where: {
        UniqueMemberUser: {
          email: email,
          memberId: memberId,
        },
      },
    });
  }

  async findManyForMember(memberId: string): Promise<UserModel[]> {
    return await this.prisma.user.findMany({ where: { memberId } });
  }

  /**
   * member内のユーザーをページネーションで取得。
   * @param memberId
   * @param searchParams
   * @param perPage
   * @returns users User[] | null
   * @throws PrismaClientKnownRequestError
   */
  async getList(
    memberId: string,
    searchParams: URLSearchParams,
    perPage: number,
  ): Promise<UserModel[] | null> {
    const params: Prisma.UserFindManyArgs = {
      where: {
        memberId,
      },
    };

    if (searchParams instanceof URLSearchParams) {
      // 検索
      const searchQuery = searchParams.get("searchQuery");
      const role = searchParams.get("role") as Role;
      const createdAt_gte = dayjs(
        searchParams.get("createdAt_gte"),
      ).toISOString();
      const createdAt_lte = dayjs(
        searchParams.get("createdAt_lte"),
      ).toISOString();

      params.where = {
        ...params.where,
        role,
        createdAt: {
          gte: createdAt_gte,
          lte: createdAt_lte,
        },
        OR: [
          { name: { contains: searchQuery || undefined } },
          { email: { contains: searchQuery || undefined } },
        ],
      };

      // ページネーション

      const page = Number(searchParams.get("page"));
      const skip = page > 0 ? (page - 1) * perPage : 0;
      params.skip = skip;
      params.take = perPage;
    }

    return await this.prisma.user.findMany(params);
  }

  /**
   * メンバー内のユニークユーザー数を取得
   * @param memberId
   * @returns count
   * @throws PrismaClientKnownRequestError
   */
  async countByMemberId(memberId: string): Promise<number> {
    return await this.prisma.user.count({ where: { memberId } });
  }

  /**
   * ユーザー作成
   * @param user
   * @returns
   */
  async create(user: Prisma.UserCreateInput): Promise<UserModel> {
    return await this.prisma.user.create({ data: user });
  }
}

export default UserRepository;
