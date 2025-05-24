import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'store_challenge',
  entities: [],
  synchronize: false,
  logging: true,
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrations: [
    __dirname + '/../../**/infrastructure/persistence/migrations/*.{ts,js}',
  ],
};

export default config;
