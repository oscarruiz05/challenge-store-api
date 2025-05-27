import { Test, TestingModule } from '@nestjs/testing';
import { CreateCustomerUseCase } from './create-customer.use-case';
import { CustomerRepository } from '../../domain/repositories/customer.repository,interface';
import { Customer } from '../../domain/models/customer.model';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let customerRepository: CustomerRepository;

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
        CreateCustomerUseCase,
        {
          provide: 'CustomerRepository',
          useValue: {
            save: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateCustomerUseCase>(CreateCustomerUseCase);
    customerRepository = module.get<CustomerRepository>('CustomerRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new customer successfully', async () => {
      const command = {
        name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        number_phone: '1234567890',
        address: '123 Main St',
      };

      const result = await useCase.execute(command);

      expect(uuidv4).toHaveBeenCalled();
      expect(customerRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUuid,
          name: command.name,
          last_name: command.last_name,
          email: command.email,
          number_phone: command.number_phone,
          address: command.address,
        }),
      );
      expect(result).toEqual(mockCustomer);
    });

    it('should throw an error if repository save fails', async () => {
      const command = {
        name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        number_phone: '1234567890',
        address: '123 Main St',
      };

      jest.spyOn(customerRepository, 'save').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute(command)).rejects.toThrow('Database error');
    });
  });
});