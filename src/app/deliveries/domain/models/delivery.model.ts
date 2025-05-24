import { DeliveryStatusEnum } from "../../infrastructure/persistence/entities/delivery.orm";

export class Delivery {
  id: string;
  transaction_id: string;
  product_id: string;
  customer_id: string;
  address: string;
  status: DeliveryStatusEnum;

  constructor(
    id: string,
    transaction_id: string,
    product_id: string,
    customer_id: string,
    address: string,
    status: DeliveryStatusEnum,
  ) {
    this.id = id;
    this.transaction_id = transaction_id;
    this.product_id = product_id;
    this.customer_id = customer_id;
    this.address = address;
    this.status = status;
  }
}