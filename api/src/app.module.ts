import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from './db/db.module';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, HelperModule]
})
export class AppModule {}
