import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository,interface';
import { Customer } from '../../domain/models/customer.model';
import { UpdateCustomerUseCase } from './update-customer.use-case';
import { CreateCustomerUseCase } from './create-customer.use-case';

export interface CreateOrUpdateCustomerCommand {
  name: string;
  last_name: string;
  email: string;
  number_phone: string;
  address: string;
}

@Injectable()
export class CreateOrUpdateCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
  ) {}

  async execute(command: CreateOrUpdateCustomerCommand): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findByEmail(command.email);

    if (existingCustomer) {
        return this.updateCustomerUseCase.execute({id: existingCustomer.id, ...command});
    }

    return this.createCustomerUseCase.execute(command);
  }
}
