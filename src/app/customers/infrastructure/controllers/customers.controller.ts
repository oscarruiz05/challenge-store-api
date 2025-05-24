import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CustomerService } from '../../application/services/customer.service';
import { Customer } from '../../domain/models/customer.model';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(
    @Body() customerData: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.createCustomer(customerData);
  }

  @Get(':id')
  async getCustomerById(id: string): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() customerData: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.updateCustomer({ ...customerData, id });
  }
}
