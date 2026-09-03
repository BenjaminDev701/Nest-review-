import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      //*Solo permite la entrada de nuestros datos con la validacion que tienen los DTO
      whitelist: true,
      //*Retorna un eror 400 si el usuario mando un campo o informacion que no es permitida por los DTO
      forbidNonWhitelisted: true

    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
