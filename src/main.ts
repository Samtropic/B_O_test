import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { EntityPropertyNotFoundFilter } from './common/filters/typeorm-exception/entity-property-not-found-exception.filter';
import { QueryFailedErrorFilter } from './common/filters/typeorm-exception/query-failed-exception.filter';
import { TimeoutInterceptor } from './common/interceptors copy/timeout/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors copy/wrap-response/wrap-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.enableCors();
  const apiPath = 'api';
  app.setGlobalPrefix(apiPath);

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

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new EntityPropertyNotFoundFilter(),
    new QueryFailedErrorFilter(),
  );

  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );

  const options = new DocumentBuilder()
    .setTitle('⚓⛵ Boats API 🚤🚢')
    .setDescription('An api for boat(s) management')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${apiPath}/docs`, app, document);
  await app.listen(3000);
}
bootstrap();
