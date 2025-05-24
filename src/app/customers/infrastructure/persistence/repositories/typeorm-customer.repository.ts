import { Customer } from './../../../domain/models/customer.model';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from './../../../domain/repositories/customer.repository,interface';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomerOrmEntity } from '../entities/customer.orm.entity';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class TypeOrmCustomerRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly customerRepository: Repository<CustomerOrmEntity>,
  ) {}

  async findById(id: string): Promise<Customer | null> {
    const ormEntity = await this.customerRepository.findOneBy({ id });
    return ormEntity ? CustomerMapper.toDomain(ormEntity) : null;
  }

  async save(customer: Customer): Promise<Customer> {
    const ormEntity = CustomerMapper.fromDomain(customer);
    const savedOrmEntity = await this.customerRepository.save(ormEntity);
    return CustomerMapper.toDomain(savedOrmEntity);
  }

  async update(customer: Customer): Promise<Customer> {
    const ormEntity = CustomerMapper.fromDomain(customer);
    const updatedOrmEntity = await this.customerRepository.save(ormEntity);
    return CustomerMapper.toDomain(updatedOrmEntity);
  }
}
