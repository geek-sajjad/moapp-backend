import * as dotenv from 'dotenv';

import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DataSource, DataSourceOptions } from 'typeorm';
import { ENVIRONMENTS } from 'src/core/enums';
import * as path from 'path';

dotenv.config();
export const configPostgres = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  let config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: configService.getOrThrow<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT', 5432),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DB'),
    autoLoadEntities: false,
    // entities: [path.join(__dirname, '/../../**/*.entity{.ts,.js}')],
    entities: [],
    migrations: [path.join(__dirname, '/../../database/migration/*.{ts,js}')],
    synchronize: false,
    logging: false,
  };
  if (configService.get('NODE_ENV') !== ENVIRONMENTS.LOCAL) {
    config = {
      ...config,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  return config as TypeOrmModuleOptions;
};

// Create the DataSource instance using the configuration
const dataSource = new DataSource(
  configPostgres(new ConfigService()) as DataSourceOptions,
);

// Export DataSource instance for TypeORM migration
export default dataSource;
