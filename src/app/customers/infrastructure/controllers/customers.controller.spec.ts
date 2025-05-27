import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomerService } from '../../application/services/customer.service';
import { Customer } from '../../domain/models/customer.model';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

describe('CustomersController', () => {
  let controller: CustomersController;
  let customerService: CustomerService;

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
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            createCustomer: jest.fn().mockResolvedValue(mockCustomer),
            getCustomerById: jest.fn().mockResolvedValue(mockCustomer),
            updateCustomer: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    customerService = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCustomer', () => {
    it('should create a customer successfully', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        number_phone: '1234567890',
        address: '123 Main St',
      };

      const result = await controller.createCustomer(createCustomerDto);

      expect(customerService.createCustomer).toHaveBeenCalledWith(createCustomerDto);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('getCustomerById', () => {
    it('should get a customer by id successfully', async () => {
      const result = await controller.getCustomerById(mockCustomerId);

      expect(customerService.getCustomerById).toHaveBeenCalledWith(mockCustomerId);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer successfully', async () => {
      // Incluimos el id en el DTO como es requerido
      const updateCustomerDto = {
        id: mockCustomerId,
        name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        number_phone: '0987654321',
        address: '456 Elm St',
      } as UpdateCustomerDto;

      const result = await controller.updateCustomer(mockCustomerId, updateCustomerDto);

      expect(customerService.updateCustomer).toHaveBeenCalledWith({
        ...updateCustomerDto,
        id: mockCustomerId,
      });
      expect(result).toEqual(mockCustomer);
    });
  });
});