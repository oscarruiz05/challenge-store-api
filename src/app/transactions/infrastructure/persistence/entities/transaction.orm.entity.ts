import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export enum TransactionStatusEnum {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    DECLINED = 'DECLINED',
    VOIDED = 'VOIDED',
    ERROR = 'ERROR',
}

@Entity('transactions')
export class TransactionOrmEntity {
    @PrimaryColumn({ type: 'uuid' })
    id: string = uuidv4();

    @Column({ type: 'uuid' })
    product_id: string;

    @Column({ type: 'uuid' })
    customer_id: string;

    @Column('int')
    quantity: number;

    @Column('decimal')
    amount: number;

    @Column('text')
    reference: string;

    @Column({
        type: 'enum',
        enum: TransactionStatusEnum,
        default: TransactionStatusEnum.PENDING,
    })
    status: TransactionStatusEnum;

    @Column({ type: 'timestamp'})
    created_at: Date;

    @Column({ type: 'timestamp'})
    updated_at: Date;
}