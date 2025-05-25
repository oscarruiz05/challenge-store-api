import {  Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerOrmEntity } from "./infrastructure/persistence/entities/customer.orm.entity";
import { CustomersController } from "./infrastructure/controllers/customers.controller";
import { TypeOrmCustomerRepository } from "./infrastructure/persistence/repositories/typeorm-customer.repository";
import { CreateCustomerUseCase } from "./application/use-cases/create-customer.use-case";
import { UpdateCustomerUseCase } from "./application/use-cases/update-customer.use-case";
import { GetCustomerUseCase } from "./application/use-cases/get-customer.use-case";
import { CustomerService } from "./application/services/customer.service";
import { CreateOrUpdateCustomerUseCase } from "./application/use-cases/create-or-update-customer.use-case";

@Module({
    imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
    controllers: [CustomersController],
    providers: [
        {
            provide: 'CustomerRepository',
            useClass: TypeOrmCustomerRepository
        },
        // use-cases
        CreateCustomerUseCase,
        UpdateCustomerUseCase,
        GetCustomerUseCase,
        CreateOrUpdateCustomerUseCase,
        // services
        CustomerService
    ],
    exports: [CreateOrUpdateCustomerUseCase, GetCustomerUseCase]
})
export class CustomersModule {}