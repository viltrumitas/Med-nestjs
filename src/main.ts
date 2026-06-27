import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      process.env.LOCAL_FRONTEND_URL,
      process.env.LOCALHOST_DATABASE_URL,
      'http://localhost:4200'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  const config = new DocumentBuilder()
    .setTitle('Med NestJS - Clinical Cases API')
    .setDescription(
      'API para gestión de casos clínicos, evaluaciones y retroalimentación entre estudiantes y profesores',
    )
    .setVersion('1.0.0')
    .setContact('Med Team', '', 'support@med.local')
    .setLicense('Proprietary', '')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access_token',
    )
    .addTag('Auth', 'Autenticación de usuarios')
    .addTag('Cases', 'Gestión de casos clínicos')
    .addTag('Reviews', 'Evaluaciones y retroalimentación')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
