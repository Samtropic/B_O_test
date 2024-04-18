import * as Joi from '@hapi/joi';
import * as path from 'path';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BoatsModule } from './boats/boats.module';
import { PostgresConfig } from './config/postgres.config';
import { EnginesModule } from './engines/engines.module';
import { LoggingMiddleware } from './common/middleware/logging/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${path.join(__dirname, '..', '.env')}`,
      validationSchema: Joi.object({
        DB_HOST: Joi.required(),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfig,
      inject: [PostgresConfig],
    }),
    UsersModule,
    BoatsModule,
    EnginesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    const conf = new PostgresConfig(new ConfigService());
    console.log(conf.createTypeOrmOptions().entities);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // All routes
    // consumer.apply(LoggingMiddleware).forRoutes('users'); // Only users routes
    // consumer.apply(LoggingMiddleware).forRoutes({path: 'users', method: RequestMethod.GET}); // Only users GET routes
    // consumer.apply(LoggingMiddleware).exclude('users').forRoutes('*'); // All routes except the users ones
  }
}
