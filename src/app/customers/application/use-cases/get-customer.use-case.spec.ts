import { Test, TestingModule } from '@nestjs/testing';
import { GetCustomerUseCase } from './get-customer.use-case';
import { CustomerRepository } from '../../domain/repositories/customer.repository,interface';
import { Customer } from '../../domain/models/customer.model';

describe('GetCustomerUseCase', () => {
  let useCase: GetCustomerUseCase;
  let customerRepository: CustomerRepository;

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
        GetCustomerUseCase,
        {
          provide: 'CustomerRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetCustomerUseCase>(GetCustomerUseCase);
    customerRepository = module.get<CustomerRepository>('CustomerRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a customer when found by id', async () => {
      const result = await useCase.execute(mockCustomerId);

      expect(customerRepository.findById).toHaveBeenCalledWith(mockCustomerId);
      expect(result).toEqual(mockCustomer);
    });

    it('should return null when customer is not found', async () => {
      jest.spyOn(customerRepository, 'findById').mockResolvedValueOnce(null);

      const result = await useCase.execute('non-existent-id');

      expect(customerRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });

    it('should throw an error if repository findById fails', async () => {
      jest.spyOn(customerRepository, 'findById').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute(mockCustomerId)).rejects.toThrow('Database error');
    });
  });
});