import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTransactionUseCase } from './update-transaction.use-case';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';

describe('UpdateTransactionUseCase', () => {
  let useCase: UpdateTransactionUseCase;
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
    'new-payment-id',
    'REF-12345678',
    TransactionStatusEnum.APPROVED
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTransactionUseCase,
        {
          provide: 'TransactionRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockTransaction),
            update: jest.fn().mockResolvedValue(updatedMockTransaction),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateTransactionUseCase>(UpdateTransactionUseCase);
    transactionRepository = module.get<TransactionRepository>('TransactionRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update transaction successfully', async () => {
      const command = {
        id: mockTransactionId,
        transaction_id: 'new-payment-id',
        status: TransactionStatusEnum.APPROVED,
      };

      const result = await useCase.execute(command);

      expect(transactionRepository.findById).toHaveBeenCalledWith(mockTransactionId);
      expect(transactionRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockTransactionId,
          transaction_id: 'new-payment-id',
          status: TransactionStatusEnum.APPROVED,
        }),
      );
      expect(result).toEqual(updatedMockTransaction);
    });

    it('should throw an error when transaction is not found', async () => {
      jest.spyOn(transactionRepository, 'findById').mockResolvedValueOnce(null);

      const command = {
        id: 'non-existent-id',
        transaction_id: 'new-payment-id',
        status: TransactionStatusEnum.APPROVED,
      };

      await expect(useCase.execute(command)).rejects.toThrow(`Transaction with id ${command.id} not found`);
      expect(transactionRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(transactionRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if repository update fails', async () => {
      jest.spyOn(transactionRepository, 'update').mockRejectedValueOnce(new Error('Database error'));

      const command = {
        id: mockTransactionId,
        transaction_id: 'new-payment-id',
        status: TransactionStatusEnum.APPROVED,
      };

      await expect(useCase.execute(command)).rejects.toThrow('Database error');
      expect(transactionRepository.findById).toHaveBeenCalledWith(mockTransactionId);
    });
  });
});