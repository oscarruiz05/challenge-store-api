import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTransactionStatusUseCase } from './update-transaction-status.use-case';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';

describe('UpdateTransactionStatusUseCase', () => {
  let useCase: UpdateTransactionStatusUseCase;
  let transactionRepository: TransactionRepository;

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

  const updatedMockTransaction = new Transaction(
    mockTransactionId,
    'product-123',
    'customer-456',
    2,
    200,
    'payment-789',
    'REF-12345678',
    TransactionStatusEnum.APPROVED
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTransactionStatusUseCase,
        {
          provide: 'TransactionRepository',
          useValue: {
            updateStatus: jest.fn().mockResolvedValue(updatedMockTransaction),
            findById: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateTransactionStatusUseCase>(UpdateTransactionStatusUseCase);
    transactionRepository = module.get<TransactionRepository>('TransactionRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update transaction status successfully', async () => {
      const command = {
        id: mockTransactionId,
        status: TransactionStatusEnum.APPROVED,
      };

      const result = await useCase.execute(command);

      expect(transactionRepository.updateStatus).toHaveBeenCalledWith(mockTransactionId, TransactionStatusEnum.APPROVED);
      expect(result).toEqual(updatedMockTransaction);
    });

    it('should throw an error when transaction is not found', async () => {
      jest.spyOn(transactionRepository, 'updateStatus').mockRejectedValueOnce(new Error('Transaction not found'));

      const command = {
        id: 'non-existent-id',
        status: TransactionStatusEnum.APPROVED,
      };

      await expect(useCase.execute(command)).rejects.toThrow('Transaction not found');
      expect(transactionRepository.updateStatus).toHaveBeenCalledWith('non-existent-id', TransactionStatusEnum.APPROVED);
    });

    it('should throw an error if repository update fails', async () => {
      jest.spyOn(transactionRepository, 'updateStatus').mockRejectedValueOnce(new Error('Database error'));

      const command = {
        id: mockTransactionId,
        status: TransactionStatusEnum.APPROVED,
      };

      await expect(useCase.execute(command)).rejects.toThrow('Database error');
      expect(transactionRepository.updateStatus).toHaveBeenCalledWith(mockTransactionId, TransactionStatusEnum.APPROVED);
    });
  });
});