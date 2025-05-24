import { Injectable } from '@nestjs/common';
import { CreateCustomerUseCase } from '../use-cases/create-customer.use-case';
import { GetCustomerUseCase } from '../use-cases/get-customer.use-case';
import { UpdateCustomerUseCase } from '../use-cases/update-customer.use-case';

@Injectable()
export class CustomerService {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
  ) {}

  async createCustomer(command: any): Promise<any> {
    return this.createCustomerUseCase.execute(command);
  }

  async getCustomerById(id: string): Promise<any> {
    return this.getCustomerUseCase.execute(id);
  }
  async updateCustomer(command: any): Promise<any> {
    return this.updateCustomerUseCase.execute(command);
  }
}
