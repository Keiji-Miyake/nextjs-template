import { Employee, PrismaClient, Shop as ShopModel } from "@prisma/client";

class ShopRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createShop(shopData: ShopModel): Promise<ShopModel> {
    return this.prisma.shop.create({ data: shopData });
  }

  async addEmployeeToShop(
    shopId: number,
    employee: Employee,
  ): Promise<ShopModel> {
    return this.prisma.shop.update({
      where: { id: shopId },
      data: {
        employees: {
          connect: { id: employee.id },
        },
      },
    });
  }

  // その他のメソッドも実装できます

  async close() {
    await this.prisma.$disconnect();
  }
}

export default ShopRepository;
