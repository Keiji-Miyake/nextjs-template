import { Platform as PlatformModel, Shop } from "@prisma/client";

import { prisma } from "@/lib/prisma";

class PlatformService {
  constructor() {}

  async createPlatform(platformData: PlatformModel): Promise<PlatformModel> {
    const createdPlatform = await prisma.platform.create({
      data: platformData,
    });
    return createdPlatform;
  }

  async addShopToPlatform(
    platformId: number,
    shop: Shop,
  ): Promise<PlatformModel> {
    const updatedPlatform = await prisma.platform.update({
      where: { id: platformId },
      data: {
        shops: {
          connect: { id: shop.id },
        },
      },
    });
    return updatedPlatform;
  }

  // その他のメソッドも実装できます
}

export default PlatformService;
