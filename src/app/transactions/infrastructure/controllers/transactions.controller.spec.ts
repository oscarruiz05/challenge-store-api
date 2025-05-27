import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionService } from '../../application/services/transaction.service';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionStatusEnum } from '../persistence/entities/transaction.orm.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dtos/update-transaction-status.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionService: TransactionService;

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
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            createTransaction: jest.fn().mockResolvedValue(mockTransaction),
            getTransactionById: jest.fn().mockResolvedValue(mockTransaction),
            getAllTransactions: jest.fn().mockResolvedValue(mockTransactions),
            processTransactionPayment: jest.fn().mockResolvedValue(mockPaymentResult),
            updateTransactionStatus: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should process a transaction payment successfully', async () => {
      const createTransactionDto: CreateTransactionDto = {
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

      const result = await controller.createTransaction(createTransactionDto);

      expect(transactionService.processTransactionPayment).toHaveBeenCalledWith(createTransactionDto);
      expect(result).toEqual(mockPaymentResult);
    });
  });

  describe('getTransactionById', () => {
    it('should get a transaction by id successfully', async () => {
      const result = await controller.getTransactionById(mockTransactionId);

      expect(transactionService.getTransactionById).toHaveBeenCalledWith(mockTransactionId);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('getAllTransactions', () => {
    it('should get all transactions successfully', async () => {
      const result = await controller.getAllTransactions();

      expect(transactionService.getAllTransactions).toHaveBeenCalled();
      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(3);
    });
  });

  describe('updateTransactionStatus', () => {
    it('should update transaction status successfully', async () => {
      const updateTransactionStatusDto: UpdateTransactionStatusDto = {
        status: TransactionStatusEnum.APPROVED,
      };

      const result = await controller.updateTransactionStatus(mockTransactionId, updateTransactionStatusDto);

      expect(transactionService.updateTransactionStatus).toHaveBeenCalledWith({
        id: mockTransactionId,
        status: TransactionStatusEnum.APPROVED,
      });
      expect(result).toEqual(mockTransaction);
    });
  });
});