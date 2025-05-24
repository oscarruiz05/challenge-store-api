import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './app/products/products.module';
import { CustomersModule } from './app/customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    ProductsModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
