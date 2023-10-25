import { Platform as PlatformModel, Shop } from "@prisma/client";

class Platform {
  private platform: PlatformModel;
  private shops: Shop[];

  constructor(platform: PlatformModel) {
    this.platform = platform;
    this.shops = [];
  }

  public getPlatform(): PlatformModel {
    return this.platform;
  }

  public addShop(shop: Shop): void {
    this.shops.push(shop);
  }

  public getShops(): Shop[] {
    return this.shops;
  }
}

export default Platform;
