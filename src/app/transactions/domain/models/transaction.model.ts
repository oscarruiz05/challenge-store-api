import { TransactionStatusEnum } from "../../infrastructure/persistence/entities/transaction.orm.entity";

export class Transaction {
  id: string;
  product_id: string;
  customer_id: string;
  quantity: number;
  amount: number;
  transaction_id: string | null;
  reference: string;
  status: TransactionStatusEnum;

  constructor(
    id: string,
    product_id: string,
    customer_id: string,
    quantity: number,
    amount: number,
    transaction_id: string | null,
    reference: string,
    status: TransactionStatusEnum,
  ) {
    this.id = id;
    this.product_id = product_id;
    this.customer_id = customer_id;
    this.quantity = quantity;
    this.amount = amount;
    this.transaction_id = transaction_id;
    this.reference = reference;
    this.status = status;
  }
}