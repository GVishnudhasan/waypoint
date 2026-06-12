import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS for frontend
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`\n🚀 Waypoint API running on http://localhost:${port}`);
  console.log(`📡 Socket.IO ready on ws://localhost:${port}`);
  console.log(`📊 API docs: http://localhost:${port}/api\n`);
}
bootstrap();
