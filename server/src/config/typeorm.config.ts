import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
  logging: configService.get('NODE_ENV') !== 'production',
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    // Connection pooling settings for Supabase
    max: 10,
    connectionTimeoutMillis: 10000,
  },
});
