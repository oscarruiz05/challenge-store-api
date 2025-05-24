import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export enum DeliveryStatusEnum {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
}

@Entity('deliveries')
export class DeliveryOrmEntity {
    @PrimaryColumn({ type: 'uuid' })
    id: string = uuidv4();

    @Column({ type: 'uuid' })
    transaction_id: string;

    @Column({ type: 'uuid' })
    product_id: string;

    @Column({ type: 'uuid' })
    customer_id: string;

    @Column({ type: 'text' })
    address: string;

    @Column({
        type: 'enum',
        enum: DeliveryStatusEnum,
        default: DeliveryStatusEnum.PENDING,
    })
    status: DeliveryStatusEnum;

    @Column({ type: 'timestamp'})
    created_at: Date;

    @Column({ type: 'timestamp'})
    updated_at: Date;
}