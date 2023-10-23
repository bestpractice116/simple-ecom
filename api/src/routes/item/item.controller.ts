import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { ItemService } from "./item.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("item")
export class ItemController {
  constructor(private readonly item: ItemService) {}

  @Get("/get-all")
  async getAllItems() {
    return await this.item.getAllItems();
  }

  @Get("/:id")
  async getItemById(@Param("id") id: string) {
    return await this.item.getItemById(id);
  }

  @Post("/add-new")
  @UseInterceptors(FileInterceptor("image"))
  async addNewItem(@Body() data: {
    name: string,
    description: string,
    price: number
  }, @UploadedFile(new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 5242880 })] })) image: Express.Multer.File) {
    return await this.item.addNewItem(data.name, data.description, image, data.price);
  }
}
