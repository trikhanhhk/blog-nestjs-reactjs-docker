import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Api document Khablo')
    .setDescription("List api created by Khanhnt")
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('User')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // app.use(cors())
  app.enableCors({
    origin: "*"
  });
  await app.listen(3000);
}
bootstrap();
