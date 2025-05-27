import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTransactionsUseCase } from './get-all-transactions.use-case';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';

describe('GetAllTransactionsUseCase', () => {
  let useCase: GetAllTransactionsUseCase;
  let transactionRepository: TransactionRepository;

  const mockTransactions = [
    new Transaction('1', 'product-1', 'customer-1', 1, 100, 'payment-1', 'REF-1', TransactionStatusEnum.PENDING),
    new Transaction('2', 'product-2', 'customer-2', 2, 200, 'payment-2', 'REF-2', TransactionStatusEnum.APPROVED),
    new Transaction('3', 'product-3', 'customer-3', 3, 300, 'payment-3', 'REF-3', TransactionStatusEnum.DECLINED),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllTransactionsUseCase,
        {
          provide: 'TransactionRepository',
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockTransactions),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAllTransactionsUseCase>(GetAllTransactionsUseCase);
    transactionRepository = module.get<TransactionRepository>('TransactionRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all transactions', async () => {
      const result = await useCase.execute();

      expect(transactionRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(3);
    });

    it('should return empty array when no transactions exist', async () => {
      jest.spyOn(transactionRepository, 'findAll').mockResolvedValueOnce([]);

      const result = await useCase.execute();

      expect(transactionRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should throw an error if repository findAll fails', async () => {
      jest.spyOn(transactionRepository, 'findAll').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute()).rejects.toThrow('Database error');
    });
  });
});