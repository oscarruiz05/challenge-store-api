import { TransactionOrmEntity } from './../../app/transactions/infrastructure/persistence/entities/transaction.orm.entity';
import * as dotenv from 'dotenv';
import { ProductOrmEntity } from '../../app/products/infrastructure/persistence/entities/product.orm.entity';
import { DataSource } from 'typeorm';
import { CustomerOrmEntity } from '../../app/customers/infrastructure/persistence/entities/customer.orm.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'store_challenge',
  entities: [ProductOrmEntity, CustomerOrmEntity, TransactionOrmEntity],
  synchronize: false,
  logging: true,
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});