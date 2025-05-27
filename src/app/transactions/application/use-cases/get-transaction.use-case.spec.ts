import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionUseCase } from './get-transaction.use-case';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';

describe('GetTransactionUseCase', () => {
  let useCase: GetTransactionUseCase;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionUseCase,
        {
          provide: 'TransactionRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetTransactionUseCase>(GetTransactionUseCase);
    transactionRepository = module.get<TransactionRepository>('TransactionRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a transaction when found by id', async () => {
      const result = await useCase.execute(mockTransactionId);

      expect(transactionRepository.findById).toHaveBeenCalledWith(mockTransactionId);
      expect(result).toEqual(mockTransaction);
    });

    it('should return null when transaction is not found', async () => {
      jest.spyOn(transactionRepository, 'findById').mockResolvedValueOnce(null);

      const result = await useCase.execute('non-existent-id');

      expect(transactionRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });

    it('should throw an error if repository findById fails', async () => {
      jest.spyOn(transactionRepository, 'findById').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute(mockTransactionId)).rejects.toThrow('Database error');
    });
  });
});