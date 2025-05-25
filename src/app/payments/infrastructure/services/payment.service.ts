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
    acceptanceToken: string;
    acceptPersonalAuth: string;
  }): Promise<{
    status: PaymentStatus;
    transactionId: string;
    outcomeMessage: string;
  }> {
    const signature = await this.createSignature(
      params.amountInCents,
      params.currency,
      params.reference,
    );

    const response: any = await axios.post(
      `${this.apiUrl}/transactions`,
      {
        acceptance_token: params.acceptanceToken,
        accept_personal_auth: params.acceptPersonalAuth,
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
        signature: signature,
      },
      {
        headers: {
          Authorization: `Bearer ${this.privateKey}`,
        },
      },
    );

    const data: any = response.data.data;

    return {
      status: data.status as PaymentStatus,
      transactionId: data.id,
      outcomeMessage: data.status_message,
    };
  }

  private async createSignature(
    amount: number,
    currency: string,
    reference: string,
  ): Promise<string> {
    const raw = `${reference}${amount}${currency}${this.integrityKey}`;
    const encondedText = new TextEncoder().encode(raw);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}
