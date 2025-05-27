import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { CreateTransactionUseCase } from '../use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from '../use-cases/get-transaction.use-case';
import { GetAllTransactionsUseCase } from '../use-cases/get-all-transactions.use-case';
import { ProcessTransactionPaymentUseCase } from '../use-cases/process-transaction-payment.use-case';
import { UpdateTransactionStatusUseCase } from '../use-cases/update-transaction-status.use-case';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';

describe('TransactionService', () => {
  let service: TransactionService;
  let createTransactionUseCase: CreateTransactionUseCase;
  let getTransactionUseCase: GetTransactionUseCase;
  let getAllTransactionsUseCase: GetAllTransactionsUseCase;
  let processTransactionPaymentUseCase: ProcessTransactionPaymentUseCase;
  let updateTransactionStatusUseCase: UpdateTransactionStatusUseCase;

  const mockTransactionId = '123e4567-e89b-12d3-a456-426614174000';
  const mockTransaction = new Transaction(
    mockTransactionId,
    'product-123',
    'customer-456',
    2,
    200,
    'payment-789',
    'REF-12345678',
    TransactionStatusEnum.PENDING
  );

  const mockTransactions = [
    mockTransaction,
    new Transaction('2', 'product-2', 'customer-2', 1, 100, 'payment-2', 'REF-2', TransactionStatusEnum.APPROVED),
    new Transaction('3', 'product-3', 'customer-3', 3, 300, 'payment-3', 'REF-3', TransactionStatusEnum.DECLINED),
  ];

  const mockPaymentResult = {
    message: 'Payment approved',
    payment_status: TransactionStatusEnum.APPROVED,
    order_id: mockTransactionId,
    amount: 200,
    quantity: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: CreateTransactionUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
        {
          provide: GetTransactionUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
        {
          provide: GetAllTransactionsUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockTransactions),
          },
        },
        {
          provide: ProcessTransactionPaymentUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockPaymentResult),
          },
        },
        {
          provide: UpdateTransactionStatusUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    createTransactionUseCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    getTransactionUseCase = module.get<GetTransactionUseCase>(GetTransactionUseCase);
    getAllTransactionsUseCase = module.get<GetAllTransactionsUseCase>(GetAllTransactionsUseCase);
    processTransactionPaymentUseCase = module.get<ProcessTransactionPaymentUseCase>(ProcessTransactionPaymentUseCase);
    updateTransactionStatusUseCase = module.get<UpdateTransactionStatusUseCase>(UpdateTransactionStatusUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should call createTransactionUseCase.execute with the correct parameters', async () => {
      const createTransactionCommand = {
        product_id: 'product-123',
        customer_id: 'customer-456',
        quantity: 2,
        amount: 200,
        transaction_id: null,
        reference: 'REF-12345678',
      };

      const result = await service.createTransaction(createTransactionCommand);

      expect(createTransactionUseCase.execute).toHaveBeenCalledWith(createTransactionCommand);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('getTransactionById', () => {
    it('should call getTransactionUseCase.execute with the correct parameters', async () => {
      const result = await service.getTransactionById(mockTransactionId);

      expect(getTransactionUseCase.execute).toHaveBeenCalledWith(mockTransactionId);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('getAllTransactions', () => {
    it('should call getAllTransactionsUseCase.execute', async () => {
      const result = await service.getAllTransactions();

      expect(getAllTransactionsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(3);
    });
  });

  describe('processTransactionPayment', () => {
    it('should call processTransactionPaymentUseCase.execute with the correct parameters', async () => {
      const processPaymentCommand = {
        product_id: 'product-123',
        quantity: 2,
        card_token: 'card-token-123',
        acceptance_token: 'acceptance-token-123',
        accept_personal_auth: 'personal-auth-123',
        customer: {
          name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          number_phone: '1234567890',
          address: '123 Main St',
        },
      };

      const result = await service.processTransactionPayment(processPaymentCommand);

      expect(processTransactionPaymentUseCase.execute).toHaveBeenCalledWith(processPaymentCommand);
      expect(result).toEqual(mockPaymentResult);
    });
  });

  describe('updateTransactionStatus', () => {
    it('should call updateTransactionStatusUseCase.execute with the correct parameters', async () => {
      const updateStatusCommand = {
        id: mockTransactionId,
        status: TransactionStatusEnum.APPROVED,
      };

      const result = await service.updateTransactionStatus(updateStatusCommand);

      expect(updateTransactionStatusUseCase.execute).toHaveBeenCalledWith(updateStatusCommand);
      expect(result).toEqual(mockTransaction);
    });
  });
});