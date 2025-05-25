import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';
import { GetProductUseCase } from '../../../products/application/use-cases/get-product.use-case';
import { UpdateProductStockUseCase } from '../../../products/application/use-cases/update-product-stock.use-case';
import { PaymentGateway } from '../../../payments/domain/ports/payment.gateway';
import { PaymentStatus } from '../../../payments/domain/enums/payment-status.enum';
import { CreateDeliveryUseCase } from '../../../deliveries/application/use-cases/create-delivery.use-case';
import { CreateOrUpdateCustomerUseCase } from '../../../customers/application/use-cases/create-or-update-customer.use-case';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { UpdateTransactionStatusUseCase } from './update-transaction-status.use-case';
import { UpdateTransactionUseCase } from './update-transaction.use-case';
import { CheckTransactionStatusTask } from '../../infrastructure/tasks/check-transaction-status.task';
import { FinalizeApprovedTransactionUseCase } from './finalize-approved-transaction.use-case';

export interface ProcessTransactionPaymentCommand {
  product_id: string;
  quantity: number;
  card_token: string;
  acceptance_token: string;
  accept_personal_auth: string;
  customer: {
    name: string;
    last_name: string;
    email: string;
    number_phone: string;
    address: string;
  };
}

export interface TransactionResult {
  success: boolean;
  message: string;
  payment_status: TransactionStatusEnum;
  error?: any;
}

@Injectable()
export class ProcessTransactionPaymentUseCase {
  constructor(
    @Inject('PaymentGateway')
    private readonly paymentGateway: PaymentGateway,
    private readonly createOrUpdateCustomerUseCase: CreateOrUpdateCustomerUseCase,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly updateProductStockUseCase: UpdateProductStockUseCase,
    private readonly createDeliveryUseCase: CreateDeliveryUseCase,
    private readonly checkTransactionStatusTask: CheckTransactionStatusTask,
    private readonly finalizeApprovedTransactionUseCase: FinalizeApprovedTransactionUseCase,
  ) {}

  async execute(
    command: ProcessTransactionPaymentCommand,
  ): Promise<TransactionResult> {
    // buscar y validar si existe el producto
    const product = await this.getProductUseCase.execute(command.product_id);
    if (!product) {
      throw new NotFoundException(
        `Product with ID ${command.product_id} not found`,
      );
    }

    // validar si el producto tiene stock suficiente
    if (product.stock < command.quantity) {
      throw new BadRequestException(
        `Not enough stock available. Requested: ${command.quantity}, Available: ${product.stock}`,
      );
    }

    // buscar y validar si existe el cliente
    const customer = await this.createOrUpdateCustomerUseCase.execute(
      command.customer,
    );

    // crear la transacción y generar el ID de referencia
    const reference = `REF-${uuidv4().substring(0, 8)}`;
    const amount = product.price * command.quantity;

    const transaction = await this.createTransactionUseCase.execute({
      product_id: product.id,
      customer_id: customer.id,
      quantity: command.quantity,
      amount: amount,
      transaction_id: null,
      reference: reference,
    });

    try {
      // procesar el pago con la pasarela
      const paymentResult = await this.paymentGateway.chargeCard({
        amountInCents: Math.round(amount * 100),
        currency: 'COP',
        customerEmail: customer.email,
        token: command.card_token,
        reference: reference,
        description: `Purchase of ${command.quantity} units of product ${product.name}`,
        acceptanceToken: command.acceptance_token,
        acceptPersonalAuth: command.accept_personal_auth,
      });

      // actualizar el estado de la transacción según el resultado del pago
      const status = this.mapPaymentStatusToTransactionStatus(
        paymentResult.status,
      );
      await this.updateTransactionUseCase.execute({
        id: transaction.id,
        status: status,
        transaction_id: paymentResult.transactionId,
      });

      // si el pago está pendiente, iniciar la tarea de verificación
      if (status === TransactionStatusEnum.PENDING) {
        this.checkTransactionStatusTask.start(transaction.id);
      }

      // si el pago fue aprobado, actualizar el stock del producto y crear la entrega
      if (status === TransactionStatusEnum.APPROVED) {
        await this.finalizeApprovedTransactionUseCase.execute(transaction.id);
        
        return {
          success: true,
          message: 'Payment approved and delivery created',
          payment_status: status,
        };
      }

      return {
        success: false,
        message: paymentResult.outcomeMessage,
        payment_status: status,
      };
    } catch (error) {
      console.log("🚀 ~ ProcessTransactionPaymentUseCase ~ error:", error)
      const status = TransactionStatusEnum.ERROR;
      await this.updateTransactionStatusUseCase.execute({
        id: transaction.id,
        status: status,
      });

      return {
        success: false,
        message: 'Payment error: ' + (error.message || 'Unknown error'),
        payment_status: status,
        error: error.response.data.error,
      };
    }
  }

  private mapPaymentStatusToTransactionStatus(
    paymentStatus: PaymentStatus,
  ): TransactionStatusEnum {
    const status = {
      [PaymentStatus.APPROVED]: TransactionStatusEnum.APPROVED,
      [PaymentStatus.DECLINED]: TransactionStatusEnum.DECLINED,
      [PaymentStatus.VOIDED]: TransactionStatusEnum.VOIDED,
      [PaymentStatus.ERROR]: TransactionStatusEnum.ERROR,
    };
    return status[paymentStatus] || TransactionStatusEnum.PENDING;
  }
}
