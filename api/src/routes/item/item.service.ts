import { HttpException, Injectable } from "@nestjs/common";
import { ItemRepository } from "../../db/item.repository";
import { StorageService } from "../../helper/storage.service";

@Injectable()
export class ItemService {
  constructor(private readonly itemRepo: ItemRepository, private readonly storage: StorageService) {}

  async addNewItem(name: string, description: string, image: Express.Multer.File, price: number) {

    const [imageURl, storageError] = await this.storage.uploadFile(image.originalname.replace(/\s/g, "-"), image);

    if (storageError) {
      throw new HttpException(storageError.message, storageError.status);
    }

    const [item, dbError] = await this.itemRepo.create(name, description, imageURl, price);

    if (dbError) {
      throw new HttpException(dbError.message, dbError.status);
    }

    return item;
  }

  async getAllItems() {
    const [items, dbError] = await this.itemRepo.getAll();

    if (dbError) {
      throw new HttpException(dbError.message, dbError.status);
    }

    return items;
  }

  async getItemById(id: string) {
    const [item, dbError] = await this.itemRepo.get(id);

    if (dbError) {
      throw new HttpException(dbError.message, dbError.status);
    }

    return item;
  }
}
