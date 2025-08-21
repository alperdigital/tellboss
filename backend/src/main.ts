// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const config = new DocumentBuilder()
    .setTitle('TellBoss API')
    .setDescription('v1.0 endpoints')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Enter: Bearer <token>',
      },
      'bearer',
    )
    .addSecurityRequirements('bearer')
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, doc);

  // 🔑 Önemli kısım: 0.0.0.0 üzerinde dinle
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`✅ API listening on http://localhost:${port}`);
  console.log(`✅ Swagger:        http://localhost:${port}/api-docs`);
}
bootstrap();
