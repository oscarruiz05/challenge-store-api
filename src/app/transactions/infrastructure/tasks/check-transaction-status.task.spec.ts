import { Test, TestingModule } from '@nestjs/testing';
import { CheckTransactionStatusTask } from './check-transaction-status.task';
import { CheckTransactionStatusUseCase } from '../../application/use-cases/check-transaction-status.use-case';
import { TransactionsGateway } from '../gateways/transactions.gateway';
import { SchedulerRegistry } from '@nestjs/schedule';

describe('CheckTransactionStatusTask', () => {
  let task: CheckTransactionStatusTask;
  let checkTransactionStatusUseCase: CheckTransactionStatusUseCase;
  let schedulerRegistry: SchedulerRegistry;

  const mockTransactionId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckTransactionStatusTask,
        {
          provide: CheckTransactionStatusUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: SchedulerRegistry,
          useValue: {
            doesExist: jest.fn().mockReturnValue(false),
            addInterval: jest.fn(),
            deleteInterval: jest.fn(),
          },
        },
      ],
    }).compile();

    task = module.get<CheckTransactionStatusTask>(CheckTransactionStatusTask);
    checkTransactionStatusUseCase = module.get<CheckTransactionStatusUseCase>(CheckTransactionStatusUseCase);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  it('should be defined', () => {
    expect(task).toBeDefined();
  });

  describe('start', () => {
    it('should start checking transaction status', async () => {
      task.start(mockTransactionId);

      // Verify that the interval was added
      expect(schedulerRegistry.addInterval).toHaveBeenCalledWith(
        `check-status-${mockTransactionId}`,
        expect.any(Object)
      );
    });

    it('should not start if interval already exists', async () => {
      jest.spyOn(schedulerRegistry, 'doesExist').mockReturnValueOnce(true);

      task.start(mockTransactionId);

      expect(schedulerRegistry.addInterval).not.toHaveBeenCalled();
    });
  });
});