import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCustomerUseCase } from './update-customer.use-case';
import { CustomerRepository } from '../../domain/repositories/customer.repository,interface';
import { Customer } from '../../domain/models/customer.model';

describe('UpdateCustomerUseCase', () => {
  let useCase: UpdateCustomerUseCase;
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

  const updatedMockCustomer = new Customer(
    mockCustomerId,
    'Jane',
    'Smith',
    'jane.smith@example.com',
    '0987654321',
    '456 Elm St'
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCustomerUseCase,
        {
          provide: 'CustomerRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockCustomer),
            save: jest.fn().mockResolvedValue(updatedMockCustomer),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateCustomerUseCase>(UpdateCustomerUseCase);
    customerRepository = module.get<CustomerRepository>('CustomerRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a customer successfully', async () => {
      const command = {
        id: mockCustomerId,
        name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        number_phone: '0987654321',
        address: '456 Elm St',
      };

      const result = await useCase.execute(command);

      expect(customerRepository.findById).toHaveBeenCalledWith(mockCustomerId);
      expect(customerRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockCustomerId,
          name: command.name,
          last_name: command.last_name,
          email: command.email,
          number_phone: command.number_phone,
          address: command.address,
        }),
      );
      expect(result).toEqual(updatedMockCustomer);
    });

    it('should throw an error when customer is not found', async () => {
      jest.spyOn(customerRepository, 'findById').mockResolvedValueOnce(null);

      const command = {
        id: 'non-existent-id',
        name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        number_phone: '0987654321',
        address: '456 Elm St',
      };

      await expect(useCase.execute(command)).rejects.toThrow('Customer not found');
      expect(customerRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(customerRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error if repository save fails', async () => {
      jest.spyOn(customerRepository, 'save').mockRejectedValueOnce(new Error('Database error'));

      const command = {
        id: mockCustomerId,
        name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        number_phone: '0987654321',
        address: '456 Elm St',
      };

      await expect(useCase.execute(command)).rejects.toThrow('Database error');
      expect(customerRepository.findById).toHaveBeenCalledWith(mockCustomerId);
    });
  });
});