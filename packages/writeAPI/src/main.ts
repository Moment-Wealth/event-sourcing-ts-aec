import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpErrorFilter } from "./interceptors/errors.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //now we apply the interceptor
  app.useGlobalFilters(new HttpErrorFilter());

  await app.listen(3000);
}
bootstrap();
