import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./db/db.module";
import { HelperModule } from "./helper/helper.module";
import { ItemModule } from "./routes/item/item.module";
import { StripeModule } from "./routes/stripe/stripe.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, HelperModule, ItemModule, StripeModule]
})
export class AppModule {}
