import { Test, TestingModule } from '@nestjs/testing';
import { FinalizeApprovedTransactionUseCase } from './finalize-approved-transaction.use-case';
import { UpdateProductStockUseCase } from '../../../products/application/use-cases/update-product-stock.use-case';
import { CreateDeliveryUseCase } from '../../../deliveries/application/use-cases/create-delivery.use-case';
import { GetTransactionUseCase } from './get-transaction.use-case';
import { GetProductUseCase } from '../../../products/application/use-cases/get-product.use-case';
import { GetCustomerUseCase } from '../../../customers/application/use-cases/get-customer.use-case';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';
import { Product } from '../../../products/domain/models/product.model';
import { Customer } from '../../../customers/domain/models/customer.model';
import { NotFoundException } from '@nestjs/common';

describe('FinalizeApprovedTransactionUseCase', () => {
  let useCase: FinalizeApprovedTransactionUseCase;
  let updateProductStockUseCase: UpdateProductStockUseCase;
  let createDeliveryUseCase: CreateDeliveryUseCase;
  let getTransactionUseCase: GetTransactionUseCase;
  let getProductUseCase: GetProductUseCase;
  let getCustomerUseCase: GetCustomerUseCase;

  const mockTransactionId = '123e4567-e89b-12d3-a456-426614174000';
  const mockTransaction = new Transaction(
    mockTransactionId,
    'product-123',
    'customer-456',
    2,
    200,
    'payment-789',
    'REF-12345678',
    TransactionStatusEnum.APPROVED
  );

  const mockProduct = new Product(
    'product-123',
    'Test Product',
    'Test Description',
    'test-image.jpg',
    100,
    10
  );

  const mockCustomer = new Customer(
    'customer-456',
    'John',
    'Doe',
    'john.doe@example.com',
    '1234567890',
    '123 Main St'
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinalizeApprovedTransactionUseCase,
        {
          provide: UpdateProductStockUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: CreateDeliveryUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: GetTransactionUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
        {
          provide: GetProductUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProduct),
          },
        },
        {
          provide: GetCustomerUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
      ],
    }).compile();

    useCase = module.get<FinalizeApprovedTransactionUseCase>(FinalizeApprovedTransactionUseCase);
    updateProductStockUseCase = module.get<UpdateProductStockUseCase>(UpdateProductStockUseCase);
    createDeliveryUseCase = module.get<CreateDeliveryUseCase>(CreateDeliveryUseCase);
    getTransactionUseCase = module.get<GetTransactionUseCase>(GetTransactionUseCase);
    getProductUseCase = module.get<GetProductUseCase>(GetProductUseCase);
    getCustomerUseCase = module.get<GetCustomerUseCase>(GetCustomerUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should finalize an approved transaction successfully', async () => {
      await useCase.execute(mockTransactionId);

      expect(getTransactionUseCase.execute).toHaveBeenCalledWith(mockTransactionId);
      expect(getProductUseCase.execute).toHaveBeenCalledWith(mockTransaction.product_id);
      expect(getCustomerUseCase.execute).toHaveBeenCalledWith(mockTransaction.customer_id);
      
      expect(updateProductStockUseCase.execute).toHaveBeenCalledWith({
        id: mockProduct.id,
        stock: mockProduct.stock - mockTransaction.quantity,
      });
      
      expect(createDeliveryUseCase.execute).toHaveBeenCalledWith({
        transaction_id: mockTransactionId,
        product_id: mockProduct.id,
        customer_id: mockCustomer.id,
        address: mockCustomer.address,
      });
    });

    it('should throw an error when transaction is not found', async () => {
      jest.spyOn(getTransactionUseCase, 'execute').mockResolvedValueOnce(null);

      await expect(useCase.execute('non-existent-id')).rejects.toThrow('Transaction not found');
      expect(getTransactionUseCase.execute).toHaveBeenCalledWith('non-existent-id');
      expect(getProductUseCase.execute).not.toHaveBeenCalled();
      expect(getCustomerUseCase.execute).not.toHaveBeenCalled();
      expect(updateProductStockUseCase.execute).not.toHaveBeenCalled();
      expect(createDeliveryUseCase.execute).not.toHaveBeenCalled();
    });

    it('should throw an error when product is not found', async () => {
      jest.spyOn(getProductUseCase, 'execute').mockResolvedValueOnce(null);

      await expect(useCase.execute(mockTransactionId)).rejects.toThrow('Product not found');
      expect(getTransactionUseCase.execute).toHaveBeenCalledWith(mockTransactionId);
      expect(getProductUseCase.execute).toHaveBeenCalledWith(mockTransaction.product_id);
      expect(getCustomerUseCase.execute).not.toHaveBeenCalled();
      expect(updateProductStockUseCase.execute).not.toHaveBeenCalled();
      expect(createDeliveryUseCase.execute).not.toHaveBeenCalled();
    });

    it('should throw an error when customer is not found', async () => {
      jest.spyOn(getCustomerUseCase, 'execute').mockResolvedValueOnce(null);

      await expect(useCase.execute(mockTransactionId)).rejects.toThrow('Customer not found');
      expect(getTransactionUseCase.execute).toHaveBeenCalledWith(mockTransactionId);
      expect(getProductUseCase.execute).toHaveBeenCalledWith(mockTransaction.product_id);
      expect(getCustomerUseCase.execute).toHaveBeenCalledWith(mockTransaction.customer_id);
      expect(updateProductStockUseCase.execute).not.toHaveBeenCalled();
      expect(createDeliveryUseCase.execute).not.toHaveBeenCalled();
    });
  });
});