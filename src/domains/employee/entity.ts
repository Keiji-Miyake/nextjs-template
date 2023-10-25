import { Employee as EmployeeModel, Shop } from "@prisma/client";

class Employee {
  private employee: EmployeeModel;
  private shops: Shop[];

  constructor(employee: EmployeeModel) {
    this.employee = employee;
    this.shops = [];
  }

  public getEmployee(): EmployeeModel {
    return this.employee;
  }

  public addShop(shop: Shop): void {
    this.shops.push(shop);
  }

  public getShops(): Shop[] {
    return this.shops;
  }

  public getAuthToken(): string | null {
    return this.employee.authToken;
  }

  public setAuthToken(token: string | null): void {
    this.employee.authToken = token;
  }
}

export default Employee;
