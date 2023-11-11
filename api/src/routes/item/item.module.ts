import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { HelperModule } from "../../helper/helper.module";
import { DbModule } from "../../db/db.module";

@Module({
  imports: [HelperModule, DbModule],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
