import type { ConfigService as ConfigServiceType } from "@nestjs/config";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";
import * as compression from "compression";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });

  const config = app.get<ConfigServiceType>(ConfigService);

  app.enableCors({
    origin: config.get("CLIENT_URL"),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  });
  app.use(helmet());
  app.use(cookieParser(config.get("COOKIE_SECRET")));
  app.use(compression());

  const PORT = config.get("PORT") | 3001;

  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap();
