import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app';
import { logger } from './middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const configService: ConfigService = app.get(ConfigService);

  const port = configService.get('server.port')

  const options = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription('The authentication API description')
    .setVersion('0.0.1')
    .addTag('auth')
    .setTermsOfService('http://www.ramsy.it/tos.html')
    .setContact('Ramsy IT', 'http://www.ramsy.it', 'ramsy@ramsy.it')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(logger)

  await app.listen(port);
}
bootstrap();