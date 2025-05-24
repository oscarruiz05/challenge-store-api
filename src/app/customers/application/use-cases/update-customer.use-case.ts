import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository,interface';
import { Customer } from '../../domain/models/customer.model';

export interface UpdateCustomerCommand {
  id: string;
  name: string;
  last_name: string;
  email: string;
  number_phone: string;
  address: string;
}

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<Customer> {
    const customer = await this.customerRepository.findById(command.id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    customer.name = command.name;
    customer.last_name = command.last_name;
    customer.email = command.email;
    customer.number_phone = command.number_phone;
    customer.address = command.address;

    return this.customerRepository.save(customer);
  }
}
