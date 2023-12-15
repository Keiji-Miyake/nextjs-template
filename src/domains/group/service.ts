import { Employee, Shop as ShopModel } from "@prisma/client";

import { prisma } from "@/lib/prisma";

class ShopService {
  constructor() {}

  async createShop(shopData: ShopModel): Promise<ShopModel> {
    const createdShop = await prisma.shop.create({
      data: shopData,
    });
    return createdShop;
  }

  async addEmployeeToShop(
    shopId: number,
    employee: Employee,
  ): Promise<ShopModel> {
    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        employees: {
          connect: { id: employee.id },
        },
      },
    });
    return updatedShop;
  }

  // その他のメソッドも実装できます
}

export default ShopService;
