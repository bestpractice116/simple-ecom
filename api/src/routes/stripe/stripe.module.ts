import { Module } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { HelperModule } from "../../helper/helper.module";

@Module({
  imports: [HelperModule],
  providers: [StripeService],
  controllers: [StripeController]
})
export class StripeModule {}
