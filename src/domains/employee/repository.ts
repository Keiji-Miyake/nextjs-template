import { Employee as EmployeeModel, PrismaClient, Shop } from "@prisma/client";

class EmployeeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createEmployee(employeeData: EmployeeModel): Promise<EmployeeModel> {
    return this.prisma.employee.create({ data: employeeData });
  }

  async addShopToEmployee(
    employeeId: number,
    shop: Shop,
  ): Promise<EmployeeModel> {
    return this.prisma.employee.update({
      where: { id: employeeId },
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

export default EmployeeRepository;
