import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { HelperModule } from "../../helper/helper.module";

@Module({
  imports: [HelperModule],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
