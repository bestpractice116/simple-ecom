import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { MailService } from "./mail.service";
import { StorageService } from "./storage.service";

@Module({
  providers: [PrismaService, MailService, StorageService],
  exports: [PrismaService, MailService, StorageService]
})
export class HelperModule {}
