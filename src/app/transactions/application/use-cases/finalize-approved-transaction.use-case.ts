import { Injectable } from "@nestjs/common";
import { GetCustomerUseCase } from './../../../customers/application/use-cases/get-customer.use-case';
import { GetProductUseCase } from './../../../products/application/use-cases/get-product.use-case';
import { UpdateProductStockUseCase } from '../../../products/application/use-cases/update-product-stock.use-case';
import { CreateDeliveryUseCase } from '../../../deliveries/application/use-cases/create-delivery.use-case';
import { GetTransactionUseCase } from "./get-transaction.use-case";

@Injectable()
export class FinalizeApprovedTransactionUseCase {
  constructor(
    private readonly updateProductStockUseCase: UpdateProductStockUseCase,
    private readonly createDeliveryUseCase: CreateDeliveryUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase
  ) {}

  async execute(transactionId: string): Promise<void> {
    const transaction = await this.getTransactionUseCase.execute(transactionId);
    if (!transaction) throw new Error('Transaction not found');

    const product = await this.getProductUseCase.execute(transaction.product_id);
    if (!product) throw new Error('Product not found');

    const customer = await this.getCustomerUseCase.execute(transaction.customer_id);
    if (!customer) throw new Error('Customer not found');

    // actualizar stock
    const newStock = product.stock - transaction.quantity;
    await this.updateProductStockUseCase.execute({ id: product.id, stock: newStock });

    // crear entrega
    await this.createDeliveryUseCase.execute({
      transaction_id: transaction.id,
      product_id: product.id,
      customer_id: customer.id,
      address: customer.address,
    });
  }
}