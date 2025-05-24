import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository,interface';
import { Customer } from '../../domain/models/customer.model';

@Injectable()
export class GetCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(id: string): Promise<Customer | null> {
    return this.customerRepository.findById(id);
  }
}
