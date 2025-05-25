import { PaymentStatus } from '../enums/payment-status.enum';

export interface PaymentGateway {
  chargeCard(params: {
    amountInCents: number;
    currency: 'COP';
    customerEmail: string;
    token: string;
    reference: string;
    description: string;
  }): Promise<{
    status: PaymentStatus;
    transactionId: string;
    outcomeMessage: string;
  }>;
}
