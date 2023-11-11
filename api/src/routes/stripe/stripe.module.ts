import { Module } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { HelperModule } from "../../helper/helper.module";
import { DbModule } from "../../db/db.module";

@Module({
  imports: [HelperModule, DbModule],
  providers: [StripeService],
  controllers: [StripeController]
})
export class StripeModule {}
