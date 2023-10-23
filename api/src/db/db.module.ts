import { Module } from "@nestjs/common";
import { HelperModule } from "../helper/helper.module";
import { ItemRepository } from "./item.repository";
import { OrderRepository } from "./order.repository";

@Module({
  imports: [HelperModule],
  providers: [ItemRepository, OrderRepository],
  exports: [ItemRepository, OrderRepository]
})
export class DbModule {}
