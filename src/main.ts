import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'; 
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true,transform :true }),
  );

  app.setGlobalPrefix('api/v1');

  app.use(express.json({ limit: '100mb' })); // for JSON bodies
  app.use(express.urlencoded({ limit: '100mb', extended: true })); // for form data

  const port: number = 3000;
  await app.listen(process.env.PORT ?? port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
