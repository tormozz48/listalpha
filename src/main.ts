import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3001;

  // Serve static files from the 'public' directory
  app.useStaticAssets(join(process.cwd(), 'public'), {
    index: 'index.html',
  });

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
