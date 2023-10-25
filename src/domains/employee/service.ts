import { Employee as EmployeeModel, Shop } from "@prisma/client";

import { prisma } from "@/lib/prisma";

class EmployeeService {
  constructor() {}

  async createEmployee(employeeData: EmployeeModel): Promise<EmployeeModel> {
    const createdEmployee = await prisma.employee.create({
      data: employeeData,
    });
    return createdEmployee;
  }

  async addShopToEmployee(
    employeeId: number,
    shop: Shop,
  ): Promise<EmployeeModel> {
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        shops: {
          connect: { id: shop.id },
        },
      },
    });
    return updatedEmployee;
  }

  // その他のメソッドも実装できます
}

export default EmployeeService;
