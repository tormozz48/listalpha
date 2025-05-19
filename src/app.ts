import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function createApplication(httpPort?: number): Promise<NestExpressApplication> {
  const logger = new Logger(AppModule.name);
  logger.log('Creating application...');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  if (process.env.NODE_ENV === 'production') {
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            connectSrc: ["'self'", 'https:', 'http:'],
            fontSrc: ["'self'", 'https:', 'data:'],
          },
        },
      }),
    );
  }
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'public'), {
    index: 'index.html',
  });

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('ListAlpha API')
    .setDescription('API documentation for ListAlpha application')
    .setVersion('1.0')
    .addTag('search', 'Search operations')
    .addTag('status', 'Application status')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = httpPort || process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);

  return app;
}

if (require.main === module) {
  createApplication();
}
