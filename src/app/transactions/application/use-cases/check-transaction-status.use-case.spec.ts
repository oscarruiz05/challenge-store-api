import { Test, TestingModule } from '@nestjs/testing';
import { CheckTransactionStatusUseCase } from './check-transaction-status.use-case';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { PaymentGateway } from '../../../payments/domain/ports/payment.gateway';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';
import { PaymentStatus } from '../../../payments/domain/enums/payment-status.enum';
import { TransactionsGateway } from '../../infrastructure/gateways/transactions.gateway';
import { FinalizeApprovedTransactionUseCase } from './finalize-approved-transaction.use-case';

describe('CheckTransactionStatusUseCase', () => {
  let useCase: CheckTransactionStatusUseCase;
  let transactionRepository: TransactionRepository;
  let paymentGateway: PaymentGateway;
  let transactionsGateway: TransactionsGateway;
  let finalizeApprovedTransactionUseCase: FinalizeApprovedTransactionUseCase;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckTransactionStatusUseCase,
        {
          provide: 'TransactionRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockTransaction),
            updateStatus: jest.fn().mockResolvedValue({
              ...mockTransaction,
              status: TransactionStatusEnum.APPROVED,
            }),
          },
        },
        {
          provide: 'PaymentGateway',
          useValue: {
            getTransactionStatus: jest.fn().mockResolvedValue({
              status: PaymentStatus.APPROVED,
            }),
          },
        },
        {
          provide: TransactionsGateway,
          useValue: {
            emitStatusUpdate: jest.fn(),
          },
        },
        {
          provide: FinalizeApprovedTransactionUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    useCase = module.get<CheckTransactionStatusUseCase>(CheckTransactionStatusUseCase);
    transactionRepository = module.get<TransactionRepository>('TransactionRepository');
    paymentGateway = module.get<PaymentGateway>('PaymentGateway');
    transactionsGateway = module.get<TransactionsGateway>(TransactionsGateway);
    finalizeApprovedTransactionUseCase = module.get<FinalizeApprovedTransactionUseCase>(
      FinalizeApprovedTransactionUseCase
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should check and update transaction status successfully', async () => {
      const result = await useCase.execute(mockTransactionId);

      expect(transactionRepository.findById).toHaveBeenCalledWith(mockTransactionId);
      expect(paymentGateway.getTransactionStatus).toHaveBeenCalledWith('payment-789');
      expect(transactionRepository.updateStatus).toHaveBeenCalledWith(
        mockTransactionId,
        PaymentStatus.APPROVED
      );
      expect(finalizeApprovedTransactionUseCase.execute).toHaveBeenCalledWith(mockTransactionId);
      expect(transactionsGateway.emitStatusUpdate).toHaveBeenCalledWith(
        mockTransactionId,
        PaymentStatus.APPROVED
      );
      expect(result).toBe(true);
    });

    it('should return true when transaction is not found', async () => {
      jest.spyOn(transactionRepository, 'findById').mockResolvedValueOnce(null);

      const result = await useCase.execute('non-existent-id');

      expect(transactionRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(paymentGateway.getTransactionStatus).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return true when transaction has no payment ID', async () => {
      const transactionWithoutPaymentId = new Transaction(
        mockTransactionId,
        'product-123',
        'customer-456',
        2,
        200,
        null,
        'REF-12345678',
        TransactionStatusEnum.PENDING
      );
      jest.spyOn(transactionRepository, 'findById').mockResolvedValueOnce(transactionWithoutPaymentId);

      const result = await useCase.execute(mockTransactionId);

      expect(transactionRepository.findById).toHaveBeenCalledWith(mockTransactionId);
      expect(paymentGateway.getTransactionStatus).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if status has not changed', async () => {
      jest.spyOn(paymentGateway, 'getTransactionStatus').mockResolvedValueOnce({
        status: TransactionStatusEnum.PENDING,
      });

      const result = await useCase.execute(mockTransactionId);

      expect(transactionRepository.findById).toHaveBeenCalledWith(mockTransactionId);
      expect(paymentGateway.getTransactionStatus).toHaveBeenCalledWith('payment-789');
      expect(transactionRepository.updateStatus).not.toHaveBeenCalled();
      expect(finalizeApprovedTransactionUseCase.execute).not.toHaveBeenCalled();
      expect(transactionsGateway.emitStatusUpdate).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should handle payment gateway errors', async () => {
      jest.spyOn(paymentGateway, 'getTransactionStatus').mockRejectedValueOnce(new Error('Gateway error'));

      await expect(useCase.execute(mockTransactionId)).rejects.toThrow('Gateway error');
      expect(transactionRepository.findById).toHaveBeenCalledWith(mockTransactionId);
      expect(paymentGateway.getTransactionStatus).toHaveBeenCalledWith('payment-789');
      expect(transactionRepository.updateStatus).not.toHaveBeenCalled();
      expect(finalizeApprovedTransactionUseCase.execute).not.toHaveBeenCalled();
      expect(transactionsGateway.emitStatusUpdate).not.toHaveBeenCalled();
    });
  });
});