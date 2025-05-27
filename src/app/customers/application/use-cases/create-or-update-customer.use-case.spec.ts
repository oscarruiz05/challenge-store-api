import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrUpdateCustomerUseCase } from './create-or-update-customer.use-case';
import { CustomerRepository } from '../../domain/repositories/customer.repository,interface';
import { Customer } from '../../domain/models/customer.model';
import { v4 as uuidv4 } from 'uuid';
import { UpdateCustomerUseCase } from './update-customer.use-case';
import { CreateCustomerUseCase } from './create-customer.use-case';

jest.mock('uuid');

describe('CreateOrUpdateCustomerUseCase', () => {
  let useCase: CreateOrUpdateCustomerUseCase;
  let customerRepository: CustomerRepository;
  let updateCustomerUseCase: UpdateCustomerUseCase;
  let createCustomerUseCase: CreateCustomerUseCase;

  const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
  const mockCustomer = new Customer(
    mockUuid,
    'John',
    'Doe',
    'john.doe@example.com',
    '1234567890',
    '123 Main St'
  );

  beforeEach(async () => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrUpdateCustomerUseCase,
        {
          provide: 'CustomerRepository',
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: UpdateCustomerUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
        {
          provide: CreateCustomerUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateOrUpdateCustomerUseCase>(CreateOrUpdateCustomerUseCase);
    customerRepository = module.get<CustomerRepository>('CustomerRepository');
    updateCustomerUseCase = module.get<UpdateCustomerUseCase>(UpdateCustomerUseCase);
    createCustomerUseCase = module.get<CreateCustomerUseCase>(CreateCustomerUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new customer when customer does not exist', async () => {
      jest.spyOn(customerRepository, 'findByEmail').mockResolvedValue(null);

      const command = {
        name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        number_phone: '1234567890',
        address: '123 Main St',
      };

      const result = await useCase.execute(command);

      expect(customerRepository.findByEmail).toHaveBeenCalledWith(command.email);
      expect(createCustomerUseCase.execute).toHaveBeenCalledWith(command);
      expect(updateCustomerUseCase.execute).not.toHaveBeenCalled();
      expect(result).toEqual(mockCustomer);
    });

    it('should update an existing customer when customer exists', async () => {
      const existingCustomer = new Customer(
        mockUuid,
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
        '123 Main St'
      );
      jest.spyOn(customerRepository, 'findByEmail').mockResolvedValue(existingCustomer);

      const command = {
        name: 'John',
        last_name: 'Smith',
        email: 'john.doe@example.com',
        number_phone: '9876543210',
        address: '456 Elm St',
      };

      const result = await useCase.execute(command);

      expect(customerRepository.findByEmail).toHaveBeenCalledWith(command.email);
      expect(updateCustomerUseCase.execute).toHaveBeenCalledWith({
        id: mockUuid,
        ...command,
      });
      expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
      expect(result).toEqual(mockCustomer);
    });

    it('should throw an error if repository findByEmail fails', async () => {
      jest.spyOn(customerRepository, 'findByEmail').mockRejectedValueOnce(new Error('Database error'));

      const command = {
        name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        number_phone: '1234567890',
        address: '123 Main St',
      };

      await expect(useCase.execute(command)).rejects.toThrow('Database error');
      expect(customerRepository.findByEmail).toHaveBeenCalledWith(command.email);
      expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
      expect(updateCustomerUseCase.execute).not.toHaveBeenCalled();
    });

    it('should throw an error if createCustomerUseCase fails', async () => {
      jest.spyOn(customerRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(createCustomerUseCase, 'execute').mockRejectedValueOnce(new Error('Create error'));

      const command = {
        name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        number_phone: '1234567890',
        address: '123 Main St',
      };

      await expect(useCase.execute(command)).rejects.toThrow('Create error');
      expect(customerRepository.findByEmail).toHaveBeenCalledWith(command.email);
      expect(createCustomerUseCase.execute).toHaveBeenCalledWith(command);
      expect(updateCustomerUseCase.execute).not.toHaveBeenCalled();
    });

    it('should throw an error if updateCustomerUseCase fails', async () => {
      const existingCustomer = new Customer(
        mockUuid,
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
        '123 Main St'
      );
      jest.spyOn(customerRepository, 'findByEmail').mockResolvedValue(existingCustomer);
      jest.spyOn(updateCustomerUseCase, 'execute').mockRejectedValueOnce(new Error('Update error'));

      const command = {
        name: 'John',
        last_name: 'Smith',
        email: 'john.doe@example.com',
        number_phone: '9876543210',
        address: '456 Elm St',
      };

      await expect(useCase.execute(command)).rejects.toThrow('Update error');
      expect(customerRepository.findByEmail).toHaveBeenCalledWith(command.email);
      expect(updateCustomerUseCase.execute).toHaveBeenCalledWith({
        id: mockUuid,
        ...command,
      });
      expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
    });
  });
});