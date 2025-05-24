import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './app/products/products.module';
import { CustomersModule } from './app/customers/customers.module';
import { TransactionsModule } from './app/transactions/transactions.module';
import { DeliveriesModule } from './app/deliveries/deliveries.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    ProductsModule,
    CustomersModule,
    TransactionsModule,
    DeliveriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
