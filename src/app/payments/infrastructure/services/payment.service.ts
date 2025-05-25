import { Injectable } from '@nestjs/common';
import { PaymentGateway } from '../../domain/ports/payment.gateway';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class PaymentService implements PaymentGateway {
  private readonly privateKey = process.env.PAYMENT_PRIVATE_KEY!;
  private readonly integrityKey = process.env.PAYMENT_INTEGRITY_KEY!;
  private readonly apiUrl = process.env.PAYMENT_API_URL;

  async chargeCard(params: {
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
  }> {
    const signature = this.createSignature(
      params.amountInCents,
      params.currency,
      params.reference,
    );

    const response = await axios.post(
      `${this.apiUrl}/transactions`,
      {
        amount_in_cents: params.amountInCents,
        currency: params.currency,
        customer_email: params.customerEmail,
        payment_method: {
          type: 'CARD',
          token: params.token,
          installments: 1,
        },
        reference: params.reference,
        payment_description: params.description,
        signature: {
          integrity: signature,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.privateKey}`,
        },
      },
    );

    const data: any = response.data;

    return {
      status: data.status as PaymentStatus,
      transactionId: data.transaction_id,
      outcomeMessage:
        data.outcome_message || 'Transaction completed successfully',
    };
  }

  private createSignature(
    amount: number,
    currency: string,
    reference: string,
  ): string {
    const raw = `${amount}${currency}${reference}${this.integrityKey}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }
}
