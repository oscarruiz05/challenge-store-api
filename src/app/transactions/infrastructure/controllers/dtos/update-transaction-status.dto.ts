import { IsEnum, IsNotEmpty } from 'class-validator';
import { TransactionStatusEnum } from '../../persistence/entities/transaction.orm.entity';

export class UpdateTransactionStatusDto {
  @IsNotEmpty()
  @IsEnum(TransactionStatusEnum)
  status: TransactionStatusEnum;
}