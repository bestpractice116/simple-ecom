import type { ConfigService as ConfigServiceType } from "@nestjs/config";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });

  const config = app.get<ConfigServiceType>(ConfigService);

  app.enableCors({
    origin: config.get("CLIENT_URL"),
    credentials: true
  });

  const PORT = config.get("PORT") | 3001;

  await app.listen(PORT, "0.0.0.0");
}

bootstrap();
