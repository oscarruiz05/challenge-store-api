import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionRepository: TransactionRepository;

  const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
  const mockTransaction = new Transaction(
    mockUuid,
    'product-123',
    'customer-456',
    2,
    200,
    'transaction-789',
    'REF-123456',
    TransactionStatusEnum.PENDING
  );

  beforeEach(async () => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: 'TransactionRepository',
          useValue: {
            save: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    transactionRepository = module.get<TransactionRepository>('TransactionRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new transaction successfully', async () => {
      const command = {
        product_id: 'product-123',
        customer_id: 'customer-456',
        quantity: 2,
        amount: 200,
        transaction_id: 'transaction-789',
        reference: 'REF-123456',
      };

      const result = await useCase.execute(command);

      expect(uuidv4).toHaveBeenCalled();
      expect(transactionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUuid,
          product_id: command.product_id,
          customer_id: command.customer_id,
          quantity: command.quantity,
          amount: command.amount,
          transaction_id: command.transaction_id,
          reference: command.reference,
          status: TransactionStatusEnum.PENDING,
        }),
      );
      expect(result).toEqual(mockTransaction);
    });

    it('should throw an error if repository save fails', async () => {
      const command = {
        product_id: 'product-123',
        customer_id: 'customer-456',
        quantity: 2,
        amount: 200,
        transaction_id: 'transaction-789',
        reference: 'REF-123456',
      };

      jest.spyOn(transactionRepository, 'save').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute(command)).rejects.toThrow('Database error');
    });
  });
});