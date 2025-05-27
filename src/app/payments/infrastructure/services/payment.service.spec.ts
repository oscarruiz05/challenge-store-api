import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import axios from 'axios';
import * as crypto from 'crypto';

jest.mock('axios');
jest.mock('crypto', () => {
  return {
    subtle: {
      digest: jest.fn(),
    },
  };
});

describe('PaymentService', () => {
  let service: PaymentService;
  
  const mockEnv = {
    PAYMENT_PRIVATE_KEY: 'test_private_key',
    PAYMENT_INTEGRITY_KEY: 'test_integrity_key',
    PAYMENT_API_URL: 'https://api.test.com',
  };

  const originalEnv = process.env;

  beforeEach(async () => {
    // Mock environment variables
    process.env = { ...originalEnv, ...mockEnv };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chargeCard', () => {
    it('should successfully charge a card', async () => {
      // Mock TextEncoder
      global.TextEncoder = jest.fn().mockImplementation(() => ({
        encode: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
      }));

      // Mock crypto.subtle.digest
      const mockHashBuffer = new ArrayBuffer(32);
      const mockHashArray = new Uint8Array(mockHashBuffer);
      mockHashArray.fill(10);
      (crypto.subtle.digest as jest.Mock).mockResolvedValue(mockHashBuffer);

      // Mock axios.post
      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          data: {
            id: 'transaction-123',
            status: PaymentStatus.APPROVED,
            status_message: 'Transaction approved',
          },
        },
      });

      const params = {
        amountInCents: 10000,
        currency: 'COP' as const,
        customerEmail: 'test@example.com',
        token: 'card-token',
        reference: 'ref-123',
        description: 'Test payment',
        acceptanceToken: 'acceptance-token',
        acceptPersonalAuth: 'personal-auth',
      };

      const result = await service.chargeCard(params);

      expect(axios.post).toHaveBeenCalledWith(
        `${mockEnv.PAYMENT_API_URL}/transactions`,
        expect.objectContaining({
          amount_in_cents: params.amountInCents,
          currency: params.currency,
          customer_email: params.customerEmail,
          reference: params.reference,
          payment_description: params.description,
        }),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockEnv.PAYMENT_PRIVATE_KEY}`,
          },
        }),
      );

      expect(result).toEqual({
        status: PaymentStatus.APPROVED,
        transactionId: 'transaction-123',
        outcomeMessage: 'Transaction approved',
      });
    });

    it('should handle API errors when charging a card', async () => {
      // Mock TextEncoder
      global.TextEncoder = jest.fn().mockImplementation(() => ({
        encode: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
      }));

      // Mock crypto.subtle.digest
      const mockHashBuffer = new ArrayBuffer(32);
      (crypto.subtle.digest as jest.Mock).mockResolvedValue(mockHashBuffer);

      // Mock axios.post to throw an error
      (axios.post as jest.Mock).mockRejectedValue(new Error('API Error'));

      const params = {
        amountInCents: 10000,
        currency: 'COP' as const,
        customerEmail: 'test@example.com',
        token: 'card-token',
        reference: 'ref-123',
        description: 'Test payment',
        acceptanceToken: 'acceptance-token',
        acceptPersonalAuth: 'personal-auth',
      };

      await expect(service.chargeCard(params)).rejects.toThrow('API Error');
    });
  });

  describe('getTransactionStatus', () => {
    it('should get transaction status successfully', async () => {
      // Mock axios.get
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          data: {
            status: PaymentStatus.APPROVED,
          },
        },
      });

      const result = await service.getTransactionStatus('transaction-123');

      expect(axios.get).toHaveBeenCalledWith(
        `${mockEnv.PAYMENT_API_URL}/transactions/transaction-123`,
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockEnv.PAYMENT_PRIVATE_KEY}`,
          },
        }),
      );

      expect(result).toEqual({
        status: PaymentStatus.APPROVED,
      });
    });

    it('should handle API errors when getting transaction status', async () => {
      // Mock axios.get to throw an error
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(service.getTransactionStatus('transaction-123')).rejects.toThrow('API Error');
    });
  });
});