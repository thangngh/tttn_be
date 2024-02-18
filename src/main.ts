import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import admin from 'firebase-admin';
import 'dotenv/config';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('E-Commerce API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.enableCors();

  admin.initializeApp({
    credential: admin.credential.cert(join('./firebase-service.json')),
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  app.setGlobalPrefix('api');
  await app.listen(parseInt(process.env.PORT) || 3000)

}
bootstrap();
