import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository,interface';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '../../domain/models/customer.model';

export interface CreateCustomerCommand {
  name: string;
  last_name: string;
  email: string;
  number_phone: string;
  address: string;
}

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<Customer> {
    const newCustomerId = uuidv4();

    const newCustomer = new Customer(
      newCustomerId,
      command.name,
      command.last_name,
      command.email,
      command.number_phone,
      command.address,
    );

    const createdCustomer = await this.customerRepository.save(newCustomer);

    return createdCustomer;
  }
}
