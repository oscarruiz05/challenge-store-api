import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsGateway } from './transactions.gateway';
import { Server } from 'socket.io';

describe('TransactionsGateway', () => {
  let gateway: TransactionsGateway;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsGateway],
    }).compile();

    gateway = module.get<TransactionsGateway>(TransactionsGateway);
    server = {
      emit: jest.fn(),
    } as any;
    gateway.server = server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('emitStatusUpdate', () => {
    it('should emit transaction status update event', () => {
      const transactionId = '123e4567-e89b-12d3-a456-426614174000';
      const status = 'APPROVED';

      gateway.emitStatusUpdate(transactionId, status);

      expect(server.emit).toHaveBeenCalledWith(`transaction-status-${transactionId}`, {
        transactionId,
        payment_status: status,
      });
    });
  });
});