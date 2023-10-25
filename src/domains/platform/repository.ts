import { Platform as PlatformModel, PrismaClient, Shop } from "@prisma/client";

class PlatformRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createPlatform(platformData: PlatformModel): Promise<PlatformModel> {
    return this.prisma.platform.create({ data: platformData });
  }

  async addShopToPlatform(
    platformId: number,
    shop: Shop,
  ): Promise<PlatformModel> {
    return this.prisma.platform.update({
      where: { id: platformId },
      data: {
        shops: {
          connect: { id: shop.id },
        },
      },
    });
  }

  // その他のメソッドも実装できます

  async close() {
    await this.prisma.$disconnect();
  }
}

export default PlatformRepository;
