import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PostgresConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      // Add postgres as type
      type: 'postgres',
      // Database host
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      // Database port
      port: this.configService.get<number>('DB_PORT', 5432),
      // Database username
      username: this.configService.get<string>('DB_USERNAME', 'root'),
      // Database password
      password: this.configService.get<string>('DB_PASSWORD', 'pass'),
      // Database name
      database: this.configService.get<string>('DB_DBNAME', 'postgres'),
      // Entity files path
      entities: [__dirname + '/../**/*.entity{.js,.ts}'],

      autoLoadEntities: true,
      // Auto-generate database schema (only for development)
      synchronize: true,
    };
  }
}
