import { Test, TestingModule } from '@nestjs/testing';
import { ProcessTransactionPaymentUseCase } from './process-transaction-payment.use-case';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { PaymentGateway } from '../../../payments/domain/ports/payment.gateway';
import { PaymentStatus } from '../../../payments/domain/enums/payment-status.enum';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';
import { GetProductUseCase } from '../../../products/application/use-cases/get-product.use-case';
import { UpdateProductStockUseCase } from '../../../products/application/use-cases/update-product-stock.use-case';
import { CreateDeliveryUseCase } from '../../../deliveries/application/use-cases/create-delivery.use-case';
import { CreateOrUpdateCustomerUseCase } from '../../../customers/application/use-cases/create-or-update-customer.use-case';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { UpdateTransactionStatusUseCase } from './update-transaction-status.use-case';
import { UpdateTransactionUseCase } from './update-transaction.use-case';
import { CheckTransactionStatusTask } from '../../infrastructure/tasks/check-transaction-status.task';
import { FinalizeApprovedTransactionUseCase } from './finalize-approved-transaction.use-case';
import { Product } from '../../../products/domain/models/product.model';
import { Customer } from '../../../customers/domain/models/customer.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProcessTransactionPaymentUseCase', () => {
  let useCase: ProcessTransactionPaymentUseCase;
  let paymentGateway: PaymentGateway;
  let getProductUseCase: GetProductUseCase;
  let createOrUpdateCustomerUseCase: CreateOrUpdateCustomerUseCase;
  let createTransactionUseCase: CreateTransactionUseCase;
  let updateTransactionUseCase: UpdateTransactionUseCase;
  let finalizeApprovedTransactionUseCase: FinalizeApprovedTransactionUseCase;

  const mockProductId = 'product-123';
  const mockProduct = {
    id: mockProductId,
    name: 'Test Product',
    description: 'Test Description',
    image: 'test-image.jpg',
    price: 100,
    stock: 10
  } as Product;

  const mockCustomerId = 'customer-456';
  const mockCustomer = {
    id: mockCustomerId,
    name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    number_phone: '1234567890',
    address: '123 Main St'
  } as Customer;

  const mockTransactionId = 'transaction-123';
  const mockTransaction = {
    id: mockTransactionId,
    product_id: mockProductId,
    customer_id: mockCustomerId,
    quantity: 2,
    amount: 200,
    transaction_id: null,
    reference: 'REF-12345678',
    status: TransactionStatusEnum.PENDING
  } as Transaction;

  const updatedMockTransaction = {
    ...mockTransaction,
    transaction_id: 'payment-789',
    status: TransactionStatusEnum.APPROVED
  } as Transaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessTransactionPaymentUseCase,
        {
          provide: GetProductUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProduct)
          }
        },
        {
          provide: UpdateProductStockUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProduct)
          }
        },
        {
          provide: CreateOrUpdateCustomerUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockCustomer)
          }
        },
        {
          provide: CreateTransactionUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockTransaction)
          }
        },
        {
          provide: UpdateTransactionUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(updatedMockTransaction)
          }
        },
        {
          provide: UpdateTransactionStatusUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(updatedMockTransaction)
          }
        },
        {
          provide: CreateDeliveryUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({})
          }
        },
        {
          provide: CheckTransactionStatusTask,
          useValue: {
            start: jest.fn()
          }
        },
        {
          provide: FinalizeApprovedTransactionUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({})
          }
        },
        {
          provide: 'PaymentGateway',
          useValue: {
            chargeCard: jest.fn().mockResolvedValue({
              status: PaymentStatus.APPROVED,
              transactionId: 'payment-789',
              outcomeMessage: 'Transaction approved'
            })
          }
        }
      ]
    }).compile();

    useCase = module.get<ProcessTransactionPaymentUseCase>(ProcessTransactionPaymentUseCase);
    paymentGateway = module.get<PaymentGateway>('PaymentGateway');
    getProductUseCase = module.get<GetProductUseCase>(GetProductUseCase);
    createOrUpdateCustomerUseCase = module.get<CreateOrUpdateCustomerUseCase>(CreateOrUpdateCustomerUseCase);
    createTransactionUseCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    updateTransactionUseCase = module.get<UpdateTransactionUseCase>(UpdateTransactionUseCase);
    finalizeApprovedTransactionUseCase = module.get<FinalizeApprovedTransactionUseCase>(FinalizeApprovedTransactionUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should process a transaction payment successfully', async () => {
      const command = {
        product_id: mockProductId,
        quantity: 2,
        card_token: 'card-token-123',
        acceptance_token: 'acceptance-token-123',
        accept_personal_auth: 'personal-auth-123',
        customer: {
          name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          number_phone: '1234567890',
          address: '123 Main St'
        }
      };

      const result = await useCase.execute(command);

      expect(getProductUseCase.execute).toHaveBeenCalledWith(mockProductId);
      expect(createOrUpdateCustomerUseCase.execute).toHaveBeenCalledWith(command.customer);
      expect(createTransactionUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({
        product_id: mockProductId,
        customer_id: mockCustomerId,
        quantity: command.quantity,
        amount: mockProduct.price * command.quantity
      }));
      expect(paymentGateway.chargeCard).toHaveBeenCalledWith(expect.objectContaining({
        amountInCents: mockProduct.price * command.quantity * 100,
        currency: 'COP',
        customerEmail: mockCustomer.email,
        token: command.card_token
      }));
      expect(updateTransactionUseCase.execute).toHaveBeenCalled();
      expect(finalizeApprovedTransactionUseCase.execute).toHaveBeenCalledWith(mockTransactionId);
      
      expect(result).toEqual(expect.objectContaining({
        message: 'Payment approved and delivery created',
        payment_status: TransactionStatusEnum.APPROVED,
        order_id: mockTransactionId
      }));
    });

    it('should throw NotFoundException when product is not found', async () => {
      jest.spyOn(getProductUseCase, 'execute').mockResolvedValueOnce(null);

      const command = {
        product_id: 'non-existent-product',
        quantity: 2,
        card_token: 'card-token-123',
        acceptance_token: 'acceptance-token-123',
        accept_personal_auth: 'personal-auth-123',
        customer: {
          name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          number_phone: '1234567890',
          address: '123 Main St'
        }
      };

      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      expect(getProductUseCase.execute).toHaveBeenCalledWith('non-existent-product');
      expect(createTransactionUseCase.execute).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when product stock is insufficient', async () => {
      const lowStockProduct = { ...mockProduct, stock: 1 };
      jest.spyOn(getProductUseCase, 'execute').mockResolvedValueOnce(lowStockProduct);

      const command = {
        product_id: mockProductId,
        quantity: 2,
        card_token: 'card-token-123',
        acceptance_token: 'acceptance-token-123',
        accept_personal_auth: 'personal-auth-123',
        customer: {
          name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          number_phone: '1234567890',
          address: '123 Main St'
        }
      };

      await expect(useCase.execute(command)).rejects.toThrow(BadRequestException);
      expect(getProductUseCase.execute).toHaveBeenCalledWith(mockProductId);
      expect(createTransactionUseCase.execute).not.toHaveBeenCalled();
    });
  });
});