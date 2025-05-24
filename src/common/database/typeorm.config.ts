import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ProductOrmEntity } from '../../app/products/infrastructure/persistence/entities/product.orm.entity';
import { DataSource } from 'typeorm';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'store_challenge',
  entities: [ProductOrmEntity],
  synchronize: false,
  logging: true,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});