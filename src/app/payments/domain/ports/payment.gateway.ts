import { PaymentStatus } from '../enums/payment-status.enum';

export interface PaymentGateway {
  chargeCard(params: {
    amountInCents: number;
    currency: 'COP';
    customerEmail: string;
    token: string;
    reference: string;
    description: string;
    acceptanceToken: string;
    acceptPersonalAuth: string;
  }): Promise<{
    status: PaymentStatus;
    transactionId: string;
    outcomeMessage: string;
  }>;

  getTransactionStatus(transactionId: string): Promise<{
    status: 'APPROVED' | 'DECLINED' | 'PENDING';
  }>;
}
