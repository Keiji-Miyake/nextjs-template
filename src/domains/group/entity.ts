import { Employee, Shop as ShopModel } from "@prisma/client";

class Shop {
  private shop: ShopModel;
  private employees: Employee[];

  constructor(shop: ShopModel) {
    this.shop = shop;
    this.employees = [];
  }

  public getShop(): ShopModel {
    return this.shop;
  }

  public addEmployee(employee: Employee): void {
    this.employees.push(employee);
  }

  public getEmployees(): Employee[] {
    return this.employees;
  }
}

export default Shop;
