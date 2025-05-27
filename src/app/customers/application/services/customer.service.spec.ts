import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CreateCustomerUseCase } from '../use-cases/create-customer.use-case';
import { GetCustomerUseCase } from '../use-cases/get-customer.use-case';
import { UpdateCustomerUseCase } from '../use-cases/update-customer.use-case';
import { Customer } from '../../domain/models/customer.model';

describe('CustomerService', () => {
  let service: CustomerService;
  let createCustomerUseCase: CreateCustomerUseCase;
  let getCustomerUseCase: GetCustomerUseCase;
  let updateCustomerUseCase: UpdateCustomerUseCase;

  const mockCustomerId = '123e4567-e89b-12d3-a456-426614174000';
  const mockCustomer = new Customer(
    mockCustomerId,
    'John',
    'Doe',
    'john.doe@example.com',
    '1234567890',
    '123 Main St'
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CreateCustomerUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
        {
          provide: GetCustomerUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
        {
          provide: UpdateCustomerUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    createCustomerUseCase = module.get<CreateCustomerUseCase>(CreateCustomerUseCase);
    getCustomerUseCase = module.get<GetCustomerUseCase>(GetCustomerUseCase);
    updateCustomerUseCase = module.get<UpdateCustomerUseCase>(UpdateCustomerUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCustomer', () => {
    it('should call createCustomerUseCase.execute with the correct parameters', async () => {
      const createCustomerCommand = {
        name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        number_phone: '1234567890',
        address: '123 Main St',
      };

      const result = await service.createCustomer(createCustomerCommand);

      expect(createCustomerUseCase.execute).toHaveBeenCalledWith(createCustomerCommand);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('getCustomerById', () => {
    it('should call getCustomerUseCase.execute with the correct parameters', async () => {
      const result = await service.getCustomerById(mockCustomerId);

      expect(getCustomerUseCase.execute).toHaveBeenCalledWith(mockCustomerId);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('updateCustomer', () => {
    it('should call updateCustomerUseCase.execute with the correct parameters', async () => {
      const updateCustomerCommand = {
        id: mockCustomerId,
        name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        number_phone: '0987654321',
        address: '456 Elm St',
      };

      const result = await service.updateCustomer(updateCustomerCommand);

      expect(updateCustomerUseCase.execute).toHaveBeenCalledWith(updateCustomerCommand);
      expect(result).toEqual(mockCustomer);
    });
  });
});